import { CheckLdap } from "@/components/ldap";
import { getLdapInfo } from "@/services/ldap";

export default async function CheckLdapPage({ params }: { params: Promise<{ sciper: string }> }) {
  const { sciper } = await params;
  const info = await getLdapInfo(sciper);

  return (
    <div className="flex flex-col items-center px-6 py-6">
      <CheckLdap sciper={sciper} info={info} />
    </div>
  );
}
