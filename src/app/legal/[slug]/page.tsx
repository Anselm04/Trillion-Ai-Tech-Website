const LEGAL: Record<string, { title: string; content: string }> = {
  terms: { title: 'Terms of Service', content: 'Add your Terms of Service here.' },
  privacy: { title: 'Privacy Policy', content: 'Add your Privacy Policy here.' },
  refund: { title: 'Refund & Cancellation Policy', content: 'Add your Refund Policy here.' },
  cookies: { title: 'Cookie Policy', content: 'Add your Cookie Policy here.' },
};

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = LEGAL[slug];
  if (!page) return (<div className="mx-auto max-w-4xl px-4 py-16"><h1 className="text-4xl font-semibold">Page not found</h1></div>);
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-semibold">{page.title}</h1>
      <div className="glass mt-8 rounded-[2rem] p-8 text-slate-300 leading-relaxed">
        <p>{page.content}</p>
      </div>
    </div>
  );
}
