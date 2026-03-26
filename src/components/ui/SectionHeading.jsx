import Reveal from "./Reveal";

function SectionHeading({ eyebrow, title, description, align = "left" }) {
  return (
    <Reveal
      className={[
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : ""
      ].join(" ")}
    >
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="mt-5 text-4xl md:text-5xl">{title}</h2>
      {description ? <p className="mt-5">{description}</p> : null}
    </Reveal>
  );
}

export default SectionHeading;
