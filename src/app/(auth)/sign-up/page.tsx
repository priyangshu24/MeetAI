
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { SignUpView } from "@/modules/auth/ui/views/sign-up-view";


    const page = async() => {
        const session = await auth.api.getSession({
            headers: await headers(),
          });
          if (!!session){
            redirect("/");
          }
        return <SignUpView />
    }
export default page;

//http://localhost:3000/sign-up