// Example NOTAMs for learning to read the format.
// They are made up (not real, current NOTAMs) but follow ICAO structure.

export interface NotamExample {
  id: string
  title: string
  description: string
  text: string
}

export const NOTAM_EXAMPLES: NotamExample[] = [
  {
    id: "rwy-closed",
    title: "Runway closure",
    description: "A runway closed every day during work hours.",
    text: `A0123/26 NOTAMN
Q) GVSC/QMRLC/IV/NBO/A/000/999/1644N02257W005
A) GVAC B) 2612010800 C) 2612151600
D) DLY 0800-1600
E) RWY 01/19 CLSD DUE WIP.`,
  },
  {
    id: "navaid-us",
    title: "Navaid unserviceable",
    description: "A ground radio beacon out of service with an estimated end time.",
    text: `A0131/26 NOTAMN
Q) GVSC/QNBAS/IV/BO/AE/000/999/1456N02329W025
A) GVNP B) 2612030600 C) 2612102359 EST
E) NDB 'PR' 345KHZ U/S DUE MAINT. RNAV APCH AVBL.`,
  },
  {
    id: "obstacle",
    title: "New obstacle",
    description: "A lit crane near the runway threshold.",
    text: `A0140/26 NOTAMN
Q) GVSC/QOBCE/IV/M/A/000/003/1644N02257W005
A) GVAC B) 2612050700 C) 2701311800
E) CRANE ERECTED 600M SW OF THR RWY 19. HGT 150FT AGL, ELEV 260FT AMSL. LGTD.`,
  },
  {
    id: "danger-area",
    title: "Danger area active",
    description: "Military exercise airspace with lower and upper limits.",
    text: `A0152/26 NOTAMN
Q) GVSC/QRDCA/IV/BO/W/000/150/1530N02400W030
A) GVSC B) 2612100900 C) 2612101500
E) DANGER AREA ACT DUE MIL EXERCISE WI 30NM RADIUS OF 1530N02400W. ACFT AVOID AREA.
F) SFC G) FL150`,
  },
  {
    id: "twy-replace",
    title: "Replacement NOTAM",
    description: "Replaces an earlier taxiway NOTAM with new information.",
    text: `A0160/26 NOTAMR A0101/26
Q) GVSC/QMXLC/IV/M/A/000/999/1608N02253W005
A) GVBA B) 2612120000 C) PERM
E) TWY B CLSD. ACFT USE TWY A FOR ARR AND DEP. PPR FOR ACFT ABV CAT C.`,
  },
  {
    id: "cancel",
    title: "Cancellation",
    description: "Cancels an earlier NOTAM before it expires.",
    text: `A0165/26 NOTAMC A0131/26
Q) GVSC/QNBAK/IV/BO/AE/000/999/1456N02329W025
A) GVNP B) 2612061200
E) NDB 'PR' 345KHZ RESUMED NORMAL OPS.`,
  },
]
