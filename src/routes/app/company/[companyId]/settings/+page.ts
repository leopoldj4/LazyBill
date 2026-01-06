import { redirect } from "@sveltejs/kit";

export const load = async ({ params }: { params: { companyId: string } }) => {
    return redirect(302, `/app/company/${params.companyId}/settings/basics`);
}