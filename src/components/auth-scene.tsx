import Image from "next/image";
import { GobletTower } from "./goblet-tower";
import { HouseBanners } from "./house-banners";

export function AuthScene() {
  return <aside className="auth-scene"><GobletTower compact/><HouseBanners className="auth-house-banners"/><div className="auth-scene-caption"><Image src="/images/crest.webp" width={72} height={72} alt="Technika 27 crest"/><span>TECHNIKA ’27</span><h2>One castle.<br /><em>Four ways to belong.</em></h2><p>“It is our choices that show what we truly are.”</p></div></aside>;
}
