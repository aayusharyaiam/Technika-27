"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, LoaderCircle, Sparkles } from "lucide-react";
import { houseThemes, selectableHouses } from "@/lib/houses";
import { emptyPreview, readPreview, savedProfileHouse, writePreview, type CeremonyPreview, type SortedHouse } from "@/lib/ceremony-preview";
import { useAuth } from "./auth-provider";
import { useMagic } from "./experience";
import { SortingHatArtwork } from "./sorting-hat-artwork";
import { HouseCrest } from "./house-crest";

const questions = [
  { prompt: "A locked door appears beneath the castle. What do you notice first?", options: ["The clever mechanism", "The safest way through", "The story carved into it", "Who might need my help"] },
  { prompt: "The Great Hall goes quiet. What would you bring to the table?", options: ["A daring new idea", "A question no one has asked", "A seat for everyone", "A plan for what comes next"] },
  { prompt: "The Hat asks for one promise. Which sounds like yours?", options: ["I will be brave enough to begin", "I will keep learning", "I will stand by my people", "I will aim higher"] },
];

export function SortingCeremony({ embedded = false }: { embedded?: boolean }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);
  if (loading || !user) return <section className="sorting-page sorting-session-loading" aria-busy="true"><LoaderCircle className="spin" size={24}/><h1>Opening the Hall…</h1><p role="status">Checking your signed-in session.</p></section>;
  // Only authenticated users get ceremony state. Existing profile houses bypass the questions.
  return <Ceremony key={user.id} profileHouse={savedProfileHouse(user.user_metadata?.house)} userId={user.id} embedded={embedded}/>;
}

function Ceremony({ profileHouse, userId, embedded }: { profileHouse: SortedHouse | null; userId: string; embedded: boolean }) {
  const storageKey = `technika:ceremony-preview:v1:${userId}`;
  const [preview, setPreview] = useState<CeremonyPreview>(emptyPreview);
  const [restored, setRestored] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlight = useRef(false);
  const { enabled } = useMagic();

  useEffect(() => {
    const frame = requestAnimationFrame(() => { setPreview(readPreview(storageKey)); setRestored(true); });
    return () => { cancelAnimationFrame(frame); if (timer.current) clearTimeout(timer.current); };
  }, [storageKey]);

  const house = profileHouse || preview.house;
  const stage = house && !speaking ? "reveal" : speaking ? "sorting" : preview.step ? "questions" : "welcome";
  useEffect(() => { if (restored) heading.current?.focus({ preventScroll: true }); }, [stage, preview.step, restored]);

  const save = (next: CeremonyPreview) => { writePreview(storageKey, next); setPreview(next); };
  const reveal = () => {
    if (inFlight.current || house) return;
    inFlight.current = true;
    setError("");
    try {
      // A uniform visual demo, independent of answers. No auth update or assignment API call.
      const entropy = crypto.getRandomValues(new Uint32Array(1))[0];
      const next = { ...preview, house: selectableHouses[entropy % 4] };
      save(next); // Refresh during the animation recovers the same preview in this tab.
      if (enabled) {
        setSpeaking(true);
        timer.current = setTimeout(() => { setSpeaking(false); inFlight.current = false; }, 1100);
      } else inFlight.current = false;
    } catch {
      inFlight.current = false;
      setError("The ceremony preview could not start. Please retry in a secure browser tab.");
    }
  };
  const nextQuestion = () => {
    if (preview.step < questions.length) save({ ...preview, step: preview.step + 1 });
    else reveal();
  };
  const theme = house ? houseThemes[house] : houseThemes.default;

  return <section className={`sorting-page sorting-${stage}${embedded ? " sorting-embedded" : ""}`} aria-label="Sorting Hat ceremony">
    <div className="sorting-stars" aria-hidden="true">{Array.from({ length: 16 }, (_, index) => <i key={index} style={{ "--star-left": `${(index * 37) % 100}%`, "--star-top": `${(index * 53) % 92}%`, "--star-delay": `${index * -.21}s` } as React.CSSProperties}/>)}</div>
    <div className="sorting-shell">
      <div className="sorting-topline"><Link href="/account" className="sorting-mark"><Sparkles size={15}/>YOUR COMMON ROOM</Link><span>{profileHouse ? "YOUR SAVED HOUSE" : "CEREMONY PREVIEW"}</span></div>
      <div className="sorting-progress" aria-hidden="true">{[0, 1, 2, 3].map((i) => <span key={i} className={house || preview.step >= i ? "active" : ""}/>)}</div>
      <div className="sorting-stage">
        <div className="sorting-visual"><div className="sorting-aura"/><SortingHatArtwork/><span className="sorting-visual-caption">A LITTLE WONDER. A PLACE TO BELONG.</span></div>
        <div className="sorting-copy" aria-busy={!restored || speaking}>
          {stage === "welcome" && <><span className="sorting-overline">The Sorting Ceremony · Chapter I</span><h1 ref={heading} tabIndex={-1}>The Hat <em>Awaits.</em></h1><p>Every great journey begins with a choice. Your story begins here.</p><div className="sorting-quote"><span>“</span><i>Take a breath. The castle is listening.</i></div><p className="sorting-preview-note">Explore the ceremony. This preview does not assign membership or save a house to your account. The questions are just for fun.</p><div className="sorting-actions"><button className="button button-gold" type="button" disabled={!restored} onClick={() => save({ ...preview, step: 1 })}>BEGIN THE CEREMONY <ArrowRight size={15}/></button><button className="sorting-skip" type="button" disabled={!restored} onClick={reveal}>Skip to the reveal <ArrowRight size={14}/></button></div></>}
          {stage === "questions" && <><span className="sorting-overline">The Hat asks · {preview.step} of {questions.length}</span><h1 ref={heading} tabIndex={-1}>Before I speak, <em>tell me this.</em></h1><p>{questions[preview.step - 1].prompt}</p><div className="sorting-options">{questions[preview.step - 1].options.map((option) => <button type="button" key={option} onClick={nextQuestion}>{option}<ArrowRight size={14}/></button>)}</div><p className="sorting-preview-note">There are no wrong answers. They do not determine the random preview.</p><button className="sorting-skip" type="button" onClick={reveal}>Skip the questions <ArrowRight size={14}/></button></>}
          {stage === "sorting" && <div className="sorting-speaking"><span className="sorting-overline">A moment of magic</span><h1 ref={heading} tabIndex={-1}>Hmm… <em>interesting.</em></h1><p role="status">Preparing your house preview…</p><div className="sorting-loader" aria-hidden="true"><span/><span/><span/></div><button className="sorting-skip" type="button" onClick={() => { if (timer.current) clearTimeout(timer.current); setSpeaking(false); inFlight.current = false; }}>Show my reveal now <ArrowRight size={14}/></button></div>}
          {stage === "reveal" && house && <><span className="sorting-overline">{profileHouse ? "The Hat remembers you" : "Your ceremony preview"}</span><h1 ref={heading} tabIndex={-1}>Welcome to <em>{theme.name}.</em></h1><p>{theme.motto}</p><div className="sorting-house-reveal" data-house={house} style={{ "--reveal-color": theme.accent, "--reveal-deep": theme.deep } as React.CSSProperties}><HouseCrest house={house}/><div><strong>{theme.name}</strong><small>{theme.quality}</small></div>{profileHouse && <Check size={17}/>}</div>{!profileHouse && <p className="sorting-preview-note" role="status">Preview only — no house has been assigned to your account. Official balanced sorting will be connected separately.</p>}<Link className="button button-gold" href="/account">ENTER YOUR COMMON ROOM <ArrowRight size={15}/></Link></>}
          {error && <p className="sorting-error" role="alert">{error}</p>}
        </div>
      </div>
      <p className="sorting-footnote">Four houses. Equal belonging. One extraordinary story.</p>
    </div>
  </section>;
}
