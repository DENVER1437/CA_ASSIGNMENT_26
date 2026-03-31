// ============================================================
//  main_memory.v
//  Main Memory — 32K x 12 bits (15-bit address)
//  Initialized with address+1 pattern for simulation testing
//  Nirma University — 2CS504 Computer Architecture
//  Team: Meet (24BCE380) & Dhruvraj (24BCE374)
// ============================================================

module main_memory (
    input  wire        clk,
    input  wire        re,           // read enable (asserted on MISS)
    input  wire [14:0] address,      // full 15-bit address from CPU
    output reg  [11:0] data_out,     // 12-bit word returned
    output reg         ready         // high for 1 cycle when data is ready
);

    // 32768 words of 12 bits
    reg [11:0] mem [0:32767];

    integer i;

    // Fill memory with a simple pattern for simulation
    initial begin
        for (i = 0; i < 32768; i = i + 1)
            mem[i] = i[11:0] + 12'h001;   // data = address + 1
        ready    = 1'b0;
        data_out = 12'b0;
    end

    // Simulate 2-cycle memory latency
    reg re_d1;

    always @(posedge clk) begin
        re_d1    <= re;
        ready    <= 1'b0;

        if (re_d1) begin
            data_out <= mem[address];
            ready    <= 1'b1;
        end
    end

endmodule
