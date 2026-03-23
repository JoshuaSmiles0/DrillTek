import { drilltekService } from '$lib/services/drilltek-service.js';
import { error, redirect } from '@sveltejs/kit';



export const actions = {

    /*
    change password server action for change password page
    takes password and oldpassword from form data and email from page params
    if any are blank throws a 400 coded error and redirects to route error page
    If login successful redirects to login page, else throws appropriate error
    and redirects to error page with associated error
    */
    changePassword: async({request, params}) => {
        const form = await request.formData();
        const email =  params.email as string;
        console.log(email)
        const password = form.get("password") as string;
        const oldPassword = form.get("oldPassword") as string;
        if (email === "" || password === "" || oldPassword === "") {
           throw error(400, {
                message:"Please Enter All Fields",
                email:email,
                status:400,
            })
        }
        else {
            const success = await drilltekService.setPassword(email,oldPassword,password)
            if (success === true) {
                throw redirect(303, `/login/${email}`)
            }
            else if (success === false) {
               throw error(401,{
                    message:"Invalid Credentials, Please Try Again",
                    status:401,
                    email: email,
                })
            }
            else {
               throw error(500,{
                    message:"Unable to process request at this time. Please Try Again",
                    email:email,
                    status:500
                })
            }
        }
    },
}