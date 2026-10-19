import { ALLOWED_GUESSES } from "./guesses";

// The reason for space-separated string instead of ["about", "above", ...]
// is because it's the same data, but much easier to read and add words to by hand.

// Words that can be the answer. Kept to common words so the puzzle is fair.
// (Allowed guesses are the much bigger ENABLE list in guesses.ts. Obscure
// words are fine to guess but would make unfair answers.)
//
// The order matters: getDailyWord uses word 0 on day 0, word 1 on day 1, etc.
// It was shuffled once so the daily words don't go in alphabetical order.
// Add new words at the END only. Inserting or removing a word earlier in the
// list would shift every later day to a different word.
export const ANSWERS: string[] = `
sunny relax whose shirt first grape panel roast paper price knife equal debut
pause grade grant smile brief shout thing blade fight given curve began upper
plant crack wheat asset ridge adopt pound yield booth error fence swift alarm
event layer civil brown humor media trunk plate value apply cover break block
scout above guess ultra chief tight reply refer faith bound usual meant phase
rebel punch allow worst prove under south treat sauce spoon stone bring newly
light globe scale eager rocky clock cheap plain theme scene green rapid lunch
group major solid might stuck sorry quite audio cause match fully phone angry
local drive chair while minor speak enjoy crown noble usage prize fifty start
along sleep built thumb seven total outer arise which floor crowd logic patch
front brush delay chose after rural mayor march lower loose forty avoid among
lover build prior close organ climb focus daily owner shark those truck candy
favor noise child label aware would proud loyal spoke shelf piano known actor
shell harsh visit imply catch shade peace rifle state video spray tower empty
carry flour ready nurse grief angle force clear vital index flesh smart rigid
aside stock sharp quote often point taste hello honor limit tooth range hurry
paint labor twice sight crane buyer small stage gross table thick movie found
adult metal taken wound fleet magic honey brick smoke heavy broke topic stair
grand basis motor guard twist unity forth shock teach stuff thank being coast
still agree trust wrote short chest spent tough shall hobby clean knock track
women ounce place voice boost piece glory store route dream timer steel tried
human array blast least brave apart youth fancy space blank orbit virus fewer
ocean share bench serve drawn urban three giant craft trail shift teeth worry
cycle sweet order snake cable tribe music inner dirty funny claim flash shake
union linen entry guest steep exact toxic scare heart cloud blood forum melon
night alert later woman false round mercy thief opera print input about vivid
chess grown title death fluid watch anger medal fiber alike party sword prime
offer steam issue water trade stick raise flood agent great plane sound scope
cream right waste swing basic model quiet since enemy chain super radio below
month slope robot juice elect frost alive spend mouth guide rider grass every
mount strip whole blind throw ought maybe there truly final merit laugh black
meter fault badly river again check ideal float dozen greet happy beach drama
fifth flame image trace polar laser leave apple rough royal count threw doubt
minus money joint mouse crash trend suite chase crime score where stood realm
reach world ratio pasta drove upset earth maker storm spike power speed breed
novel dying liver staff stand album trial class pearl glove dealt wheel extra
sugar acute wrong white photo write cross drank field could arena think chart
uncle argue cabin legal moral nerve salad drink horse award silly blame query
spine fruit vocal stove eight pizza house zebra skirt spare third onion brand
never exist slide board click tired sheet glass alone mixed frame abuse skill
judge sense valid stake early grave north worse style story study touch until
grain alter crush depth solve shine slice baker pupil whale queen pilot olive
bread coach spice other grace dress learn large level admit today habit elite
audit court sport drift chalk birth proof ahead truth hotel tiger enter young
begin react lucky press trait dance lemon feast toast shoot shape quick worth
train token charm trick brain pulse pitch sheep broad draft fresh diary pride
`.trim().split(/\s+/);

// The reason for a set is because checking "is this a real word?" happens on every guess, 
// and Set.has() is instant no matter how many words there are (an array would
// have to scan the whole list).
// ANSWERS is included too, so every possible answer can always be guessed,
// even if a word happens to be missing from the ENABLE list.
export const VALID_GUESSES = new Set([...ANSWERS, ...ALLOWED_GUESSES]);
