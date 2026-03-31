// ============================================================
//  cache_controller.v
//  Direct-Mapped Cache Memory Controller FSM
//  5 States: IDLE -> LOOKUP -> HIT / MISS -> FETCH
//  Nirma University — 2CS504 Computer Architecture
//  Team: Meet (24BCE380) & Dhruvraj (24BCE374)
// ============================================================

module cache_controller (
    input  wire        clk,
    input  wire        rst,
    input  wire        cpu_req,      // CPU requests a memory access
    input  wire [14:0] cpu_addr,     // 15-bit address from CPU
    output reg  [11:0] cpu_data,     // data returned to CPU
    output reg         cpu_ready,    // high when data is valid for CPU

    // Hit/Miss status (useful for waveform analysis)
    output reg         hit_flag,
    output reg         miss_flag,

    // Performance counters
    output reg [15:0]  hit_count,
    output reg [15:0]  miss_count
);

    // ---- Address decomposition ----
    // [14:9] = tag (6 bits)
    // [8:0]  = index (9 bits)
    wire [5:0]  tag   = cpu_addr[14:9];
    wire [8:0]  index = cpu_addr[8:0];

    // ---- FSM state encoding ----
    localparam IDLE   = 3'd0,
               LOOKUP = 3'd1,
               HIT    = 3'd2,
               MISS   = 3'd3,
               FETCH  = 3'd4;

    reg [2:0] state, next_state;

    // ---- Cache memory wires ----
    reg         cache_we;
    wire [5:0]  cache_tag_out;
    wire [11:0] cache_data_out;
    wire        cache_valid_out;
    reg  [11:0] cache_data_in;
    reg  [5:0]  cache_tag_in;

    // ---- Main memory wires ----
    reg         mem_re;
    wire [11:0] mem_data_out;
    wire        mem_ready;

    // ---- Latch address for multi-cycle operations ----
    reg [14:0] latched_addr;
    reg [5:0]  latched_tag;
    reg [8:0]  latched_index;

    // ---- Submodule instantiation ----
    cache_memory u_cache (
        .clk      (clk),
        .we       (cache_we),
        .index    (latched_index),
        .tag_in   (latched_tag),
        .data_in  (cache_data_in),
        .tag_out  (cache_tag_out),
        .data_out (cache_data_out),
        .valid_out(cache_valid_out)
    );

    main_memory u_mem (
        .clk     (clk),
        .re      (mem_re),
        .address (latched_addr),
        .data_out(mem_data_out),
        .ready   (mem_ready)
    );

    // ---- State register ----
    always @(posedge clk or posedge rst) begin
        if (rst)
            state <= IDLE;
        else
            state <= next_state;
    end

    // ---- Address latch (capture on CPU request) ----
    always @(posedge clk or posedge rst) begin
        if (rst) begin
            latched_addr  <= 15'b0;
            latched_tag   <= 6'b0;
            latched_index <= 9'b0;
        end else if (cpu_req && state == IDLE) begin
            latched_addr  <= cpu_addr;
            latched_tag   <= tag;
            latched_index <= index;
        end
    end

    // ---- Next-state logic ----
    always @(*) begin
        next_state = state;
        case (state)
            IDLE:   if (cpu_req)  next_state = LOOKUP;
            LOOKUP: begin
                        if (cache_valid_out && (cache_tag_out == latched_tag))
                            next_state = HIT;
                        else
                            next_state = MISS;
                    end
            HIT:    next_state = IDLE;
            MISS:   next_state = FETCH;
            FETCH:  if (mem_ready) next_state = IDLE;
            default: next_state = IDLE;
        endcase
    end

    // ---- Output / datapath logic ----
    always @(posedge clk or posedge rst) begin
        if (rst) begin
            cpu_data    <= 12'b0;
            cpu_ready   <= 1'b0;
            hit_flag    <= 1'b0;
            miss_flag   <= 1'b0;
            cache_we    <= 1'b0;
            mem_re      <= 1'b0;
            hit_count   <= 16'b0;
            miss_count  <= 16'b0;
            cache_data_in <= 12'b0;
            cache_tag_in  <= 6'b0;
        end else begin
            // Default de-assert
            cpu_ready  <= 1'b0;
            hit_flag   <= 1'b0;
            miss_flag  <= 1'b0;
            cache_we   <= 1'b0;
            mem_re     <= 1'b0;

            case (state)
                IDLE: begin
                    // Nothing — waiting
                end

                LOOKUP: begin
                    // Comparison happens combinationally in next-state logic
                    // Results visible next cycle
                end

                HIT: begin
                    cpu_data  <= cache_data_out;
                    cpu_ready <= 1'b1;
                    hit_flag  <= 1'b1;
                    hit_count <= hit_count + 1;
                end

                MISS: begin
                    mem_re    <= 1'b1;       // start main memory fetch
                    miss_flag <= 1'b1;
                    miss_count <= miss_count + 1;
                end

                FETCH: begin
                    if (mem_ready) begin
                        // Write fetched data into cache
                        cache_we      <= 1'b1;
                        cache_data_in <= mem_data_out;
                        cache_tag_in  <= latched_tag;
                        // Return data to CPU
                        cpu_data      <= mem_data_out;
                        cpu_ready     <= 1'b1;
                    end
                end
            endcase
        end
    end

endmodule
