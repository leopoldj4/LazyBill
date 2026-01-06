import { redirect } from "@sveltejs/kit";

export const load = async ({ params }) => {
    return redirect(302, `/app/company/${params.companyId}/customers`);
}