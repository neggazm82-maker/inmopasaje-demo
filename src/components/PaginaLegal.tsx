export default function PaginaLegal({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="bg-gradient-to-b from-azul to-white to-[300px] pt-28 pb-20">
      <article className="mx-auto max-w-3xl px-4 sm:px-6 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_li]:ml-5 [&_li]:list-disc [&_p]:mt-3 [&_p]:leading-relaxed [&_ul]:mt-3 [&_ul]:space-y-1">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{titulo}</h1>
        <p className="!mt-4 rounded-xl bg-white p-3 text-sm text-tinta-suave ring-1 ring-azul-medio">
          Texto de base para la demo. Los datos marcados como [PENDIENTE] los debe completar la empresa, y conviene que un asesor revise el texto final.
        </p>
        {children}
      </article>
    </div>
  );
}
