/** @param {NS} ns */
export async function main(ns) {
    while(true) {
      const target = ns.args[0];
  
      const target_minsecurity = ns.args[1];
      const security_margin = ns.args[2];
  
      const target_maxgross = ns.args[3];
      const gross_margin = ns.args[4];
  
      let target_security = ns.getServerSecurityLevel(target);
      let target_gross = ns.getServerMoneyAvailable(target);
  
      if (target_security > target_minsecurity * security_margin) {
        await ns.weaken(target);
      } else if (target_gross < target_maxgross * gross_margin) {
        await ns.grow(target);
      } else {
        await ns.hack(target);
      }
    }
  }