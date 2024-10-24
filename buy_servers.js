/** @param {NS} ns */
export async function main(ns) {
    const ram = ns.args[0];

    const is_allowed_ram = Number.isInteger((Math.log(ram) / Math.log(2)));

    let purchase_count = ns.args[1] == null ? 1 : ns.args[1];

    let current_index = ns.getPurchasedServers().length;

    while (is_allowed_ram && purchase_count > 0) {
        let server_cost = ns.getPurchasedServerCost(ram);
        if (ns.getServerMoneyAvailable("home") > server_cost) {
            let hostname = ns.purchaseServer(`Anthony-${current_index}`, ram);
            ns.tprint(`Purchased server "${hostname}" for ${server_cost} succesfully of ${ram} ram`);
            --purchase_count;
            ++current_index;
        } else {
          ns.tprint(`Ran out of funds for ${server_cost} cost of ${ram} ram server`);
          break;
        }
    }

    if (!is_allowed_ram) {
      ns.tprint(`Ram must be a power of 2 which does not include ${ram} ram`);
    } else if (current_index == ns.getPurchasedServerLimit()) {
      ns.tprint("Maximum amount of servers bought!");
    }
}