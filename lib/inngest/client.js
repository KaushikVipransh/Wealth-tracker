import { Inngest } from "inngest";

// 🛰️ Single Inngest client instance shared by all background functions
export const inngest = new Inngest({ id: "wealth", name: "WealthOS" });
