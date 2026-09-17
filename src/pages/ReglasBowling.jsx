import { Helmet } from "react-helmet-async";

export default function ReglasBowling() {
  return (
    <>
      <Helmet>
        <title>Reglas del Bowling | Bowling Club Gimnasia Necochea</title>
        <meta
          name="description"
          content="Aprendé cómo se anota en el bowling, qué es un strike, qué es una media y cómo se suman los puntos en Bowling Club Gimnasia Necochea."
        />
        <meta
          name="keywords"
          content="reglas del bowling, cómo se anota en bowling, puntaje bowling, strike bowling, media bowling, bowling Necochea, Bowling Club Gimnasia"
        />

        <meta property="og:title" content="Reglas del Bowling | Bowling Club Gimnasia" />
        <meta
          property="og:description"
          content="Te explicamos cómo se lleva el puntaje en bowling: turnos, tiros, strike, media y suma final."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/LogoClub.png" />
        <meta property="og:url" content="https://bowlingclubgimnasia.com/reglas-del-bowling" />

        <link
          rel="canonical"
          href="https://bowlingclubgimnasia.com/reglas-del-bowling"
        />
      </Helmet>

      <main className="min-h-screen bg-[#0a0a0a] px-4 py-24 text-white">
        <section className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <div className="mb-10 max-w-3xl">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-zinc-500">
              Bowling Club Gimnasia
            </p>

            <h1 className="mb-6 text-3xl leading-tight md:text-5xl">
              ¿CÓMO SE ANOTA EN EL BOWLING?
            </h1>

            <p className="mx-auto max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg">
              ¿Es tu primera vez jugando y no sabés cómo se lleva el puntaje?
              Te lo explicamos 👇
            </p>
          </div>

          <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-zinc-950/70 p-6 shadow-2xl shadow-black/40 md:p-10">
            <div className="space-y-8 text-center">
              <div>
                <h2 className="mb-3 text-2xl md:text-3xl">
                  📋 La planilla tiene 10 turnos
                </h2>

                <p className="mx-auto max-w-3xl text-zinc-400">
                  En cada turno, cada jugador tiene 3 tiros para derribar la
                  mayor cantidad de palos posible.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="mb-3 text-xl">
                    Casilla superior derecha
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-400">
                    Se escribe el número exacto de pinos derribados por turno.
                  </p>
                </article>

                <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="mb-3 text-xl">
                    Casilla superior izquierda
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-400">
                    Se anotan los palos que sumás al hacer un strike o media.
                  </p>
                </article>

                <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="mb-3 text-xl">
                    Casilla inferior
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-400">
                    Se van sumando los puntos obtenidos de cada turno, llevando
                    un acumulado hasta llegar al resultado final.
                  </p>
                </article>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <article className="rounded-3xl border border-white/10 bg-black/30 p-6 md:p-8">
                  <h2 className="mb-4 text-2xl md:text-3xl">
                    Strike
                  </h2>

                  <p className="text-sm leading-relaxed text-zinc-400 md:text-base">
                    Se logra al derribar los 10 pinos en el primer tiro. Se
                    anota con una X en la casilla superior derecha. Su valor es
                    de 10 puntos más la suma de los pinos que derribes en tus
                    próximos dos lanzamientos de tu siguiente turno.
                  </p>

                  <p className="mt-4 text-sm leading-relaxed text-zinc-500 md:text-base">
                    El total del cuadro no se escribe hasta que realices esos
                    dos tiros siguientes.
                  </p>
                </article>

                <article className="rounded-3xl border border-white/10 bg-black/30 p-6 md:p-8">
                  <h2 className="mb-4 text-2xl md:text-3xl">
                    Media
                  </h2>

                  <p className="text-sm leading-relaxed text-zinc-400 md:text-base">
                    Se consigue al derribar la totalidad de los 10 pinos usando
                    dos lanzamientos dentro del mismo turno. Se marca con una
                    barra diagonal (/) en la segunda casilla superior derecha.
                  </p>

                  <p className="mt-4 text-sm leading-relaxed text-zinc-500 md:text-base">
                    Su valor es de 10 puntos más los pinos que derribes en tu
                    próximo turno.
                  </p>
                </article>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
                <p className="mx-auto max-w-3xl text-lg leading-relaxed text-zinc-300 md:text-xl">
                  Al finalizar los 10 turnos, se suman los puntos y gana quien
                  tenga mayor puntaje.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}