"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LockKeyhole } from "lucide-react";
import { orderMembers } from "@/lib/festival";

const filters = ["Complete chamber", "High Council", "Web Sorcerers", "Grand Aurors", "Faculty Sentinels"];

export function OrderGallery() {
  const [filter, setFilter] = useState(filters[0]);
  const members = filter === filters[0] ? orderMembers : orderMembers.filter((member) => member.category === filter);
  return <div id="order" className="order-gallery"><div className="order-filters" aria-label="Filter the Order by chamber">{filters.map((item) => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)} aria-pressed={filter === item}>{item}</button>)}</div><motion.div layout className="order-grid"><AnimatePresence mode="popLayout">{members.map((member) => <motion.article layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .25 }} key={member.title} className="order-card"><div className="portrait-frame"><Image src={`/images/order-${member.image}.webp`} alt={`Wizarding silhouette representing ${member.role}`} fill sizes="(max-width: 560px) 80vw, (max-width: 900px) 40vw, 22vw" /><div className="portrait-lock"><span><LockKeyhole size={19} /></span><small>Enchanted veil</small></div><span className="portrait-rune">✧</span></div><div className="portrait-copy"><span>{member.category}</span><h3>{member.title}</h3><p>{member.role}</p><small><i />Identity to be revealed</small></div></motion.article>)}</AnimatePresence></motion.div><span className="sr-only" role="status">Showing {members.length} members in {filter}.</span></div>;
}
