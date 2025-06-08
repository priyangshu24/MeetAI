
import { auth } from "@/lib/auth";
import { SignInView } from "@/modules/auth/ui/views/sign-in-view";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const page = async() => {
    const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (!!session){
        redirect("/");
      }
    return <SignInView />
}
 
export default page;

//http://localhost:3000/sign-in