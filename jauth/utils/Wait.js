 // Timeout listener
 module.exports = (event, timeout, check, bot) => {
   let t;
   if (!check || typeof check !== "function") check = () => true;
   return new Promise((rs, rj) => {
     const listener = (...args) => {
       if (check && typeof check == "function" && check(...args) === true) {
         dispose();
         rs([...args]);
       }
     };
     const dispose = () => {
       bot.removeListener(event, listener);
       if (t) clearTimeout(t);
     };
     if (timeout) {
       t = setTimeout(() => {
         dispose();
         rj("timeout");
       }, timeout);
     }
     bot.on(event, listener);
   });
 };
