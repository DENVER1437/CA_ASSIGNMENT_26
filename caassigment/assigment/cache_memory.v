// ============================================================
//  cache_memory.v
//  Direct-Mapped Cache Memory Array
//  512 lines x 12-bit data | 6-bit tag | 1-bit valid
//  Nirma University — 2CS504 Computer Architecture
//  Team: Meet (24BCE380) & Dhruvraj (24BCE374)
// ============================================================

module cache_memory (
    input  wire        clk,
    input  wire        we,           // write enable (on MISS after fetch)
    input  wire [8:0]  index,        // 9-bit index from CPU address [8:0]
    input  wire [5:0]  tag_in,       // 6-bit tag to write
    input  wire [11:0] data_in,      // 12-bit data to write
    output reg  [5:0]  tag_out,      // stored tag at index
    output reg  [11:0] data_out,     // stored data at index
    output reg         valid_out     // valid bit at index
);

    // Cache storage: 512 lines
    reg [11:0] data_array [0:511];
    reg [5:0]  tag_array  [0:511];
    reg        valid_array [0:511];

    integer i;

    // Initialize all lines as invalid
    initial begin
        for (i = 0; i < 512; i = i + 1) begin
            valid_array[i] = 1'b0;
            tag_array[i]   = 6'b0;
            data_array[i]  = 12'b0;
        end
    end

    // Synchronous write
    always @(posedge clk) begin
        if (we) begin
            data_array[index]  <= data_in;
            tag_array[index]   <= tag_in;
            valid_array[index] <= 1'b1;
        end
    end

    // Asynchronous read (combinational)
    always @(*) begin
        tag_out   = tag_array[index];
        data_out  = data_array[index];
        valid_out = valid_array[index];
    end

endmodule
