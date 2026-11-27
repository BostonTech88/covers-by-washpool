"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { thermalPhotos } from "@/lib/gallery";
export default function Gallery() {
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (active !== null && !dialog.current?.open) dialog.current?.showModal();
  }, [active]);
  const photo = active === null ? null : thermalPhotos[active];
  return (
    <section id="galeria" className="section gallery">
      <div className="wrap">
        <div className="gallery-heading">
          <div>
            <p className="eyebrow">HECHAS A MEDIDA. VISTAS EN LA VIDA REAL.</p>
            <h2>
              Conoce nuestras cubiertas
              <br />
              en albercas reales.
            </h2>
          </div>
          <p>
            Fotos de nuestro producto.
            <br />
            Toca una imagen para verla de cerca.
          </p>
        </div>
        <div className="gallery-grid">
          {thermalPhotos
            .slice(0, expanded ? undefined : 6)
            .map((item, index) => (
              <figure key={item.src}>
                <button
                  type="button"
                  className="gallery-image"
                  onClick={() => setActive(index)}
                  aria-label={`Ampliar: ${item.alt}`}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 600px) 50vw, (max-width: 900px) 50vw, 33vw"
                  />
                  <span aria-hidden="true">↗</span>
                </button>
                <figcaption>{item.caption}</figcaption>
              </figure>
            ))}
        </div>
        {!expanded && (
          <div className="center">
            <button
              type="button"
              className="button button-secondary"
              onClick={() => setExpanded(true)}
            >
              Ver más fotografías <span aria-hidden="true">+</span>
            </button>
          </div>
        )}
        <dialog
          ref={dialog}
          className="photo-dialog"
          aria-label="Fotografía ampliada de cubierta térmica"
          onClose={() => setActive(null)}
          onClick={(event) => {
            if (event.target === event.currentTarget) dialog.current?.close();
          }}
        >
          {photo && (
            <>
              <div className="dialog-bar">
                <p>{photo.caption}</p>
                <button
                  type="button"
                  className="dialog-close"
                  autoFocus
                  aria-label="Cerrar fotografía"
                  onClick={() => dialog.current?.close()}
                >
                  ✕
                </button>
              </div>
              <div className="dialog-photo">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="90vw"
                  style={{ objectFit: "contain" }}
                />
              </div>
              <a
                href={photo.src}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                Abrir fotografía para ampliar ↗
              </a>
            </>
          )}
        </dialog>
      </div>
    </section>
  );
}
