import { SortingHatArtwork } from "./sorting-hat-artwork";
import { HouseCrest } from "./house-crest";
import { houseThemes, selectableHouses } from "@/lib/houses";

export function AuthScene() {
  return <aside className="auth-scene"><div className="auth-moon"/><div className="auth-dust" aria-hidden="true">{Array.from({ length: 15 }, (_, index) => <i key={index} style={{ "--dust-left": `${(index * 41) % 100}%`, "--dust-top": `${12 + (index * 29) % 75}%`, "--dust-delay": `${index * -.7}s` } as React.CSSProperties}/>)}</div><div className="auth-scene-kicker"><span className="auth-rune">✦</span><span>THE GREAT HALL · BIT PATNA</span></div><div className="auth-hat-wrap"><SortingHatArtwork/><span className="auth-hat-glow"/></div><div className="auth-scene-caption"><span>TECHNIKA ’27 · THE CEREMONY</span><h2>One castle.<br /><em>Four ways to belong.</em></h2><div className="auth-house-gallery" aria-label="The four houses">{selectableHouses.map((house) => <div key={house}><HouseCrest house={house}/><span>{houseThemes[house].name}</span></div>)}</div></div><div className="auth-scene-footer"><span>THE HAT REMEMBERS</span><i>✦</i><span>YOUR STORY BEGINS HERE</span></div></aside>;
}
