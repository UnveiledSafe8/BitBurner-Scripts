/** @param {NS} ns */
export async function main(ns) {

  const target = ns.args[0];

  let hacked_server;
  let hacked_target;

  class Queue {
    constructor() {
      this._queue = [];
    }

    push(element) {
      (this._queue).push(element);
    }

    pop() {
      return this._queue.pop(0);
    }

    show() {
      return this._queue;
    }

    clr() {
      this._queue = [];
    }
  }

  class HackServer {
    constructor(target, server) {
      this._target = target;
      this._server = server;
      this._message = `\nFailed to run hack on ${target} `;
      this._target_minsecurity = ns.getServerMinSecurityLevel(target);
      this._security_margin = 10 / 8;

      this._target_maxgross = ns.getServerMaxMoney(target);
      this._gross_margin = 1;

      this._thread_count = Math.trunc((ns.getServerMaxRam(server) - ns.getServerUsedRam(server)) / ns.getScriptRam('simple_hack.js'));
      this._ports_needed = ns.getServerNumPortsRequired(target);
      this._all_ports_opened = true;

      this._brutes = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe"];

    }

    run_brute(brute_type) {
      if (brute_type == "BruteSSH.exe") {
        ns.brutessh(this._target);
      } else if (brute_type == "FTPCrack.exe") {
        ns.ftpcrack(this._target);
      } else if (brute_type == "relaySMTP.exe") {
        ns.relaysmtp(this._target);
      } else if (brute_type == "HTTPWorm.exe") {
        ns.httpworm(this._target);
      } else if (brute_type == "SQLInject.exe") {
        ns.sqlinject(this._target);
      } else {
        ns.tprint("No brute type found");
      }
    }

    open_ports() {
      for (let i = 0; i < this._ports_needed; i++) {
        if (ns.fileExists(this._brutes[i])) {
          this.run_brute(this._brutes[i]);
        } else {
          this._all_ports_opened = false;
          this._message += `because failed to open all ports from missing program ${this._brutes[i]}`;
        }
      }

      if (this._all_ports_opened) {
        ns.nuke(this._target);
      }
    }

    execute() {
      if (this._all_ports_opened && this._thread_count > 0) {
        ns.scp("simple_hack.js", this._server);
        let script_pid = ns.exec("simple_hack.js", this._server, this._thread_count, this._target, this._target_minsecurity, this._security_margin, this._target_maxgross, this._gross_margin);
        this._message = `\nExecuted hack program PID - ${script_pid} - on ${this._target} for ${this._thread_count} threads at ${this._server}`;
      } else if (!(this._thread_count > 0)) {
        this._message += `because no available space at ${this._server}`;
      }
    }

    hack_init() {
      this.open_ports();
      this.execute();
      ns.tprint(this._message);
    }
  }

  function find_servers() {
    let queue = new Queue();
    queue.push("home");
    let servers = ["home"];

    while (queue.show().length > 0) {
      let current_node = queue.pop();
      let current_node_scan = ns.scan(current_node);

      for (let node of current_node_scan) {
        if (!servers.includes(node)) {
          servers.push(node);
          queue.push(node);
        }
      }
    }

    return servers;
  }

  if (target == "kill") {
    for (let kill_server of find_servers()) {
      ns.killall(kill_server);
    }
  } else {
    for (let new_server of find_servers()) {
      hacked_server = new HackServer(new_server, new_server);
      hacked_server.open_ports();

      hacked_target = new HackServer(target, new_server);
      hacked_target.hack_init();
    }
  }
}