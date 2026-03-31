import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const files = {
  'cache_controller.v': `// ============================================================
//  cache_controller.v
//  Direct-Mapped Cache Memory Controller FSM
//  5 States: IDLE -> LOOKUP -> HIT / MISS -> FETCH
//  Nirma University — 2CS504 Computer Architecture
//  Team: Meet (24BCE380) & Dhruvraj (24BCE374)
// ============================================================

module cache_controller (
    input  wire        clk,
    input  wire        rst,
    input  wire        cpu_req,
    input  wire [14:0] cpu_addr,
    output reg  [11:0] cpu_data,
    output reg         cpu_ready,
    output reg         hit_flag,
    output reg         miss_flag,
    output reg [15:0]  hit_count,
    output reg [15:0]  miss_count
);

    wire [5:0]  tag   = cpu_addr[14:9];
    wire [8:0]  index = cpu_addr[8:0];

    localparam IDLE   = 3'd0,
               LOOKUP = 3'd1,
               HIT    = 3'd2,
               MISS   = 3'd3,
               FETCH  = 3'd4;

    reg [2:0] state, next_state;

    reg         cache_we;
    wire [5:0]  cache_tag_out;
    wire [11:0] cache_data_out;
    wire        cache_valid_out;
    reg  [11:0] cache_data_in;
    reg  [5:0]  cache_tag_in;

    reg         mem_re;
    wire [11:0] mem_data_out;
    wire        mem_ready;

    reg [14:0] latched_addr;
    reg [5:0]  latched_tag;
    reg [8:0]  latched_index;

    cache_memory u_cache (
        .clk(clk), .we(cache_we), .index(latched_index),
        .tag_in(latched_tag), .data_in(cache_data_in),
        .tag_out(cache_tag_out), .data_out(cache_data_out),
        .valid_out(cache_valid_out)
    );

    main_memory u_mem (
        .clk(clk), .re(mem_re), .address(latched_addr),
        .data_out(mem_data_out), .ready(mem_ready)
    );

    always @(posedge clk or posedge rst) begin
        if (rst) state <= IDLE;
        else     state <= next_state;
    end

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

    always @(*) begin
        next_state = state;
        case (state)
            IDLE:   if (cpu_req) next_state = LOOKUP;
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

    always @(posedge clk or posedge rst) begin
        if (rst) begin
            cpu_data <= 12'b0; cpu_ready <= 1'b0;
            hit_flag <= 1'b0;  miss_flag <= 1'b0;
            cache_we <= 1'b0;  mem_re <= 1'b0;
            hit_count <= 16'b0; miss_count <= 16'b0;
            cache_data_in <= 12'b0; cache_tag_in <= 6'b0;
        end else begin
            cpu_ready <= 1'b0; hit_flag <= 1'b0;
            miss_flag <= 1'b0; cache_we <= 1'b0; mem_re <= 1'b0;
            case (state)
                HIT: begin
                    cpu_data <= cache_data_out;
                    cpu_ready <= 1'b1; hit_flag <= 1'b1;
                    hit_count <= hit_count + 1;
                end
                MISS: begin
                    mem_re <= 1'b1; miss_flag <= 1'b1;
                    miss_count <= miss_count + 1;
                end
                FETCH: if (mem_ready) begin
                    cache_we <= 1'b1;
                    cache_data_in <= mem_data_out;
                    cache_tag_in <= latched_tag;
                    cpu_data <= mem_data_out;
                    cpu_ready <= 1'b1;
                end
            endcase
        end
    end

endmodule`,

  'cache_memory.v': `// ============================================================
//  cache_memory.v — Direct-Mapped Cache Memory Array
//  512 lines x 12-bit data | 6-bit tag | 1-bit valid
// ============================================================

module cache_memory (
    input  wire        clk,
    input  wire        we,
    input  wire [8:0]  index,
    input  wire [5:0]  tag_in,
    input  wire [11:0] data_in,
    output reg  [5:0]  tag_out,
    output reg  [11:0] data_out,
    output reg         valid_out
);

    reg [11:0] data_array [0:511];
    reg [5:0]  tag_array  [0:511];
    reg        valid_array [0:511];
    integer i;

    initial begin
        for (i = 0; i < 512; i = i + 1) begin
            valid_array[i] = 1'b0;
            tag_array[i]   = 6'b0;
            data_array[i]  = 12'b0;
        end
    end

    always @(posedge clk) begin
        if (we) begin
            data_array[index]  <= data_in;
            tag_array[index]   <= tag_in;
            valid_array[index] <= 1'b1;
        end
    end

    always @(*) begin
        tag_out   = tag_array[index];
        data_out  = data_array[index];
        valid_out = valid_array[index];
    end

endmodule`,

  'main_memory.v': `// ============================================================
//  main_memory.v — Main Memory 32K x 12 bits
//  Initialized with address+1 pattern
// ============================================================

module main_memory (
    input  wire        clk,
    input  wire        re,
    input  wire [14:0] address,
    output reg  [11:0] data_out,
    output reg         ready
);

    reg [11:0] mem [0:32767];
    integer i;

    initial begin
        for (i = 0; i < 32768; i = i + 1)
            mem[i] = i[11:0] + 12'h001;
        ready    = 1'b0;
        data_out = 12'b0;
    end

    reg re_d1;

    always @(posedge clk) begin
        re_d1 <= re;
        ready <= 1'b0;
        if (re_d1) begin
            data_out <= mem[address];
            ready    <= 1'b1;
        end
    end

endmodule`,

  'tb_cache_controller.v': `// ============================================================
//  tb_cache_controller.v — Testbench
//  Tests: cold miss, hit, conflict miss, hit ratio
// ============================================================

\`timescale 1ns/1ps
module tb_cache_controller;

    reg         clk, rst, cpu_req;
    reg  [14:0] cpu_addr;
    wire [11:0] cpu_data;
    wire        cpu_ready, hit_flag, miss_flag;
    wire [15:0] hit_count, miss_count;

    cache_controller dut (
        .clk(clk), .rst(rst), .cpu_req(cpu_req),
        .cpu_addr(cpu_addr), .cpu_data(cpu_data),
        .cpu_ready(cpu_ready), .hit_flag(hit_flag),
        .miss_flag(miss_flag), .hit_count(hit_count),
        .miss_count(miss_count)
    );

    always #5 clk = ~clk;

    task send_request;
        input [14:0] addr;
        begin
            cpu_addr = addr; cpu_req = 1'b1;
            @(posedge clk); cpu_req = 1'b0;
            wait (cpu_ready == 1'b1);
            @(posedge clk);
            $display("[%0t] Addr=0x%04h Data=0x%03h %s Hits=%0d Misses=%0d",
                $time, addr, cpu_data,
                (hit_flag ? "HIT " : "MISS"), hit_count, miss_count);
            #10;
        end
    endtask

    initial begin
        clk = 0; rst = 1; cpu_req = 0; cpu_addr = 0;
        #20; rst = 0; #10;
        send_request(15'h0000);
        send_request(15'h0000);
        send_request(15'h0100);
        send_request(15'h0100);
        send_request(15'h4000);
        send_request(15'h0000);
        send_request(15'h0010);
        send_request(15'h0010);
        send_request(15'h0010);
        send_request(15'h0020);
        $display("Final: Hits=%0d Misses=%0d Ratio=%.2f%%",
            hit_count, miss_count,
            (hit_count * 100.0) / (hit_count + miss_count));
        $finish;
    end

    initial begin
        $dumpfile("cache_sim.vcd");
        $dumpvars(0, tb_cache_controller);
    end

endmodule`
};

function highlight(code) {
  // Phase 1: HTML-escape the raw code
  let escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Phase 2: Replace all syntax elements with unique placeholders
  // This prevents any regex from matching inside a previously-inserted <span> tag
  const tokens = [];
  let tokenId = 0;
  const ph = (html) => {
    const id = `\x00T${tokenId++}\x00`;
    tokens.push({ id, html });
    return id;
  };

  // 1. Strings  (must come before comments — strings could contain //)
  escaped = escaped.replace(/"([^"]*)"/g, (_, inner) =>
    ph(`<span style="color:#ba5e00">"${inner}"</span>`)
  );

  // 2. Comments  (must come before keywords — comments could contain keyword words)
  escaped = escaped.replace(/(\/\/.*$)/gm, (m) =>
    ph(`<span style="color:#6b7280;font-style:italic">${m}</span>`)
  );

  // 3. System tasks  ($display, $finish, etc.)
  escaped = escaped.replace(/(\$[a-zA-Z_]+)/g, (m) =>
    ph(`<span style="color:#005fb8;font-weight:500">${m}</span>`)
  );

  // 4. Keywords
  escaped = escaped.replace(/\b(module|endmodule|input|output|reg|wire|always|if|else|begin|end|posedge|negedge|assign|parameter|localparam|integer|initial|case|endcase|for|while|task|endtask|wait|default)\b/g, (m) =>
    ph(`<span style="color:#00488d;font-weight:600">${m}</span>`)
  );

  // 5. Verilog number literals  (e.g. 12'b0, 15'h0000, 3'd0)
  escaped = escaped.replace(/\b(\d+'[bhdo][0-9a-fA-F_]+)\b/g, (m) =>
    ph(`<span style="color:#2a6b2c">${m}</span>`)
  );

  // 6. Plain decimal numbers
  escaped = escaped.replace(/\b(\d+)\b/g, (m) =>
    ph(`<span style="color:#2a6b2c">${m}</span>`)
  );

  // Phase 3: Restore all tokens
  for (const { id, html } of tokens) {
    escaped = escaped.replaceAll(id, html);
  }

  return escaped;
}

export default function VerilogViewer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(Object.keys(files)[0]);
  const [copied, setCopied] = useState(false);

  const codeContent = files[activeTab];
  const lineCount = codeContent.split('\n').length;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-6 py-4 bg-white/5 hover:bg-white/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-blue-400">code</span>
          <span className="font-headline font-semibold text-white">Source Code Reference</span>
        </div>
        <span
          className="material-symbols-outlined text-slate-400 transition-transform duration-300"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          expand_more
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {/* Tabs */}
            <div className="flex border-t border-b border-white/10 bg-slate-900/50 overflow-x-auto no-scrollbar">
              {Object.keys(files).map((file) => (
                <button
                  key={file}
                  onClick={() => setActiveTab(file)}
                  className={`px-5 py-3 font-mono text-sm whitespace-nowrap transition-colors border-b-2 ${
                    activeTab === file
                      ? 'border-blue-400 text-blue-300 font-semibold bg-white/10'
                      : 'border-transparent text-slate-400 hover:bg-white/5'
                  }`}
                >
                  {file}
                </button>
              ))}
            </div>

            {/* Code */}
            <div className="relative bg-slate-950/50">
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 z-10 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs text-slate-300 font-medium transition-colors"
              >
                {copied ? '✓ Copied!' : 'Copy'}
              </button>

              <div className="overflow-x-auto p-4 flex">
                <div className="select-none pr-4 mr-4 text-right border-r border-white/10 text-slate-600 flex flex-col font-mono text-[13px] leading-relaxed">
                  {Array.from({ length: lineCount }, (_, i) => (
                    <span key={i}>{i + 1}</span>
                  ))}
                </div>
                <pre
                  className="flex-1 leading-relaxed w-max"
                  style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', lineHeight: '1.6' }}
                >
                  <code dangerouslySetInnerHTML={{ __html: highlight(codeContent) }} />
                </pre>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
