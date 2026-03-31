// ============================================================
//  tb_cache_controller.v
//  Testbench — Cache Memory Controller
//  Tests: cold miss, hit on re-access, conflict miss, hit ratio
//  Nirma University — 2CS504 Computer Architecture
//  Team: Meet (24BCE380) & Dhruvraj (24BCE374)
// ============================================================

`timescale 1ns/1ps
module tb_cache_controller;

    reg         clk, rst, cpu_req;
    reg  [14:0] cpu_addr;
    wire [11:0] cpu_data;
    wire        cpu_ready;
    wire        hit_flag, miss_flag;
    wire [15:0] hit_count, miss_count;

    // DUT
    cache_controller dut (
        .clk       (clk),
        .rst       (rst),
        .cpu_req   (cpu_req),
        .cpu_addr  (cpu_addr),
        .cpu_data  (cpu_data),
        .cpu_ready (cpu_ready),
        .hit_flag  (hit_flag),
        .miss_flag (miss_flag),
        .hit_count (hit_count),
        .miss_count(miss_count)
    );

    // 10 ns clock
    always #5 clk = ~clk;

    // Task: send one request and wait for response
    task send_request;
        input [14:0] addr;
        input [63:0] label;  // for display
        begin
            cpu_addr = addr;
            cpu_req  = 1'b1;
            @(posedge clk);
            cpu_req  = 1'b0;
            // Wait until CPU ready
            wait (cpu_ready == 1'b1);
            @(posedge clk);
            $display("[%0t ns] Addr=0x%04h | Data=0x%03h | %s | Hits=%0d Misses=%0d",
                     $time, addr, cpu_data,
                     (hit_flag ? "HIT " : "MISS"),
                     hit_count, miss_count);
            #10;
        end
    endtask

    initial begin
        clk     = 0;
        rst     = 1;
        cpu_req = 0;
        cpu_addr = 0;
        #20;
        rst = 0;
        #10;

        $display("========== Cache Controller Simulation ==========");
        $display("Direct-Mapped | 512 lines | 15-bit addr | 12-bit data");
        $display("=================================================");

        // TEST 1: Cold miss — address 0x0000 (not in cache yet)
        send_request(15'h0000, "T1_cold_miss");

        // TEST 2: HIT — same address again (now in cache)
        send_request(15'h0000, "T2_hit");

        // TEST 3: Different index, cold miss
        send_request(15'h0100, "T3_cold_miss");

        // TEST 4: HIT on 0x0100
        send_request(15'h0100, "T4_hit");

        // TEST 5: Conflict miss — same index as 0x0000 but different tag
        //         0x0000 index=0, tag=0 | 0x8000 index=0, tag=32 (conflict!)
        send_request(15'h4000, "T5_conflict_miss");

        // TEST 6: 0x0000 again — evicted by conflict, so MISS
        send_request(15'h0000, "T6_evict_miss");

        // TEST 7-10: Hit ratio demonstration
        send_request(15'h0010, "T7");
        send_request(15'h0010, "T8_hit");
        send_request(15'h0010, "T9_hit");
        send_request(15'h0020, "T10");

        $display("=================================================");
        $display("Final: Hits=%0d | Misses=%0d | Hit Ratio=%.2f%%",
                 hit_count, miss_count,
                 (hit_count * 100.0) / (hit_count + miss_count));
        $display("=================================================");
        $finish;
    end

    // VCD dump for waveform viewing in GTKWave
    initial begin
        $dumpfile("cache_sim.vcd");
        $dumpvars(0, tb_cache_controller);
    end

endmodule
