import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";



export const load: PageServerLoad = async ({ parent }) => {
const { session } = await parent();
  if (session) {
    return
  }
  else {
    redirect(302,"/")
  }
}