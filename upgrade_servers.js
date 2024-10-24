/** @param {NS} ns */
export async function main(ns) {
    const ram = ns.args[0];
  
    const max_server_ram = ns.getPurchasedServerMaxRam();
    const is_allowed_ram = Number.isInteger((Math.log(ram) / Math.log(2))) && ram <= max_server_ram;
  
    let upgrade_count = ns.args[1] == null ? 1 : ns.args[1];
  
    if (is_allowed_ram && upgrade_count > 0) {
      for (let server of ns.getPurchasedServers()) {
        if (ns.getServerMaxRam(server) < ram) {
          let upgrade_cost = ns.getPurchasedServerUpgradeCost(server, ram);
          if (ns.getServerMoneyAvailable("home") > upgrade_cost) {
            ns.upgradePurchasedServer(server, ram);
            ns.tprint(`Upgraded server "${server}" for ${upgrade_cost} succesfully to ${ram}GB`);
            --upgrade_count;
          } else {
            ns.tprint(`Ran out of funds for ${upgrade_cost} cost of ${ram}GB upgraded server`);
            break;
          }
        }
      }
    } else if (!is_allowed_ram) {
      ns.tprint(`Ram must be a power of 2 which does not include ${ram}GB ram or it exceeds ${max_server_ram}GB`);
    }
  }