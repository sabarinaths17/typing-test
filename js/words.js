/* ============================================================
   TYPEFORGE — SENTENCE POOLS
   Each difficulty has ~70 sentences. generateWords() picks
   sentences randomly (no repeats within a pass), strips
   punctuation, and returns a flat array of words.
   ============================================================ */

const SENTENCES = {

  easy: [
    "the sun rises in the east every morning",
    "she found a small cat near the garden gate",
    "he likes to drink warm tea in the morning",
    "the old clock on the wall ticked softly",
    "they went for a long walk on the beach",
    "fresh rain makes the whole world smell clean",
    "she smiled when she heard her favorite song",
    "the kids built a big tower out of blocks",
    "a red kite flew high above the trees",
    "he made a pot of soup for dinner",
    "the bookshelf was full of colorful old novels",
    "she left a note on the kitchen counter",
    "the fire crackled as they sat by the hearth",
    "birds sing their best songs at the break of dawn",
    "he packed his bag and headed to the airport",
    "the store sells fresh fruit and vegetables every day",
    "she drew a picture of a horse in the field",
    "the stars came out one by one as night fell",
    "they laughed until their sides ached with joy",
    "a warm breeze drifted through the open window",
    "the baby slept soundly through the whole storm",
    "he found his keys under the couch cushion",
    "she baked a cake for her best friend",
    "the river ran clear and cold over smooth stones",
    "they danced to old songs in the living room",
    "the dog wagged its tail at every stranger",
    "she read three chapters before falling asleep",
    "he planted roses along the fence in spring",
    "the train arrived right on time for once",
    "she kept a journal and wrote in it each night",
    "the morning fog lifted slowly from the valley below",
    "he fixed the leaky tap in the bathroom",
    "they shared a pizza and talked for hours",
    "the tree had grown very tall over the past decade",
    "she called her mother every Sunday morning without fail",
    "the cat curled up on the warm windowsill",
    "he rode his bike along the coastal path",
    "a light snow fell overnight and covered the ground",
    "she sang softly to herself while making dinner",
    "they picked berries from the bushes by the stream",
    "the old dog slept by the fire all day long",
    "he wrote a letter and sealed it in an envelope",
    "the flowers bloomed early this year in the garden",
    "she watched the sunset from the top of the hill",
    "they built a snowman in the front yard",
    "the leaves turned gold and red in the fall",
    "he ordered soup and bread at the small cafe",
    "she found a coin on the sidewalk and smiled",
    "the window was open and a cool breeze came through",
    "they visited the museum and saw ancient paintings",
    "a small spider spun a web in the corner",
    "he closed his eyes and listened to the rain",
    "she arranged the flowers in a tall glass vase",
    "they sat in the park and watched the clouds drift by",
    "the smell of coffee filled the whole apartment",
    "he tossed a coin into the fountain and made a wish",
    "she wore her favorite blue dress to the party",
    "the sunset painted the sky in shades of orange and pink",
    "they rode horses through the open meadow at dusk",
    "the moon was bright and round last night",
    "he pushed the door open and stepped inside",
    "she wrapped the gift and tied a ribbon on top",
    "the kids ran down the hill laughing out loud",
    "he opened the window to let the fresh air in",
    "she made two mugs of hot cocoa and sat down",
    "the postman left a package on the front step",
    "they watched the rain fall from the covered porch",
    "he thanked her for the kind words and help",
    "a gentle stream ran through the middle of the forest",
    "she polished her shoes before heading out the door",
  ],

  medium: [
    "the scientist explained the theory with remarkable clarity",
    "she organized her thoughts before beginning the presentation",
    "the ancient city was buried beneath centuries of soil",
    "he navigated through the dense forest without a map",
    "they discovered an unexpected solution to the old problem",
    "the documentary revealed surprising facts about ocean life",
    "she balanced her work and personal life with great care",
    "the architect designed a building that caught everyone's eye",
    "he translated the foreign document with great precision",
    "a sudden change in weather disrupted their travel plans entirely",
    "the professor challenged her students to think more independently",
    "she adapted quickly to the demands of her new role",
    "the committee reviewed the proposal and approved it unanimously",
    "he struggled to concentrate with so many distractions around him",
    "the landscape shifted dramatically as they crossed the border",
    "she invested years of effort into mastering the new language",
    "the experiment produced results that nobody had anticipated beforehand",
    "he returned the borrowed books before the deadline passed",
    "they renovated the old farmhouse and turned it into a gallery",
    "the melody lingered in her mind long after the concert ended",
    "he presented his findings at the international conference last week",
    "she negotiated a contract that satisfied everyone involved",
    "the hospital introduced new technology to improve patient care",
    "he maintained a strict daily schedule to stay productive",
    "the storm knocked out power across the entire neighborhood",
    "she volunteered at the shelter every weekend without fail",
    "the team celebrated loudly after completing the ambitious project",
    "he analyzed the data carefully and found an unexpected pattern",
    "she described the experience in vivid detail to her audience",
    "the film explored complex emotions with unexpected depth and nuance",
    "he repaired the engine using only the tools he had on hand",
    "the policy change sparked a wide debate among community members",
    "she memorized the entire speech the night before delivery",
    "the expedition crossed the mountain range in freezing conditions",
    "he contributed generously to the local fundraising campaign",
    "she recognized the pattern and solved the puzzle in seconds",
    "the company launched its product to overwhelmingly positive reviews",
    "he revised the draft several times before submitting the final version",
    "the river overflowed its banks during the prolonged heavy rainfall",
    "she maintained her composure despite the completely unexpected criticism",
    "the library recently acquired a rare collection of historical manuscripts",
    "he calculated the trajectory and adjusted the equipment accordingly",
    "she cultivated a strong reputation for honesty and careful work",
    "the journalist interviewed dozens of witnesses before the story was published",
    "the agreement was signed after months of careful back-and-forth negotiation",
    "he reconstructed the entire scene from the limited evidence available",
    "she developed a new approach to managing and analyzing large datasets",
    "the sculpture captured motion in a way that felt almost alive",
    "he scheduled the meeting to accommodate participants across all time zones",
    "the restoration revealed original details hidden under layers of old paint",
    "she collaborated closely with engineers to build a scalable platform",
    "the delegation arrived at the summit with very clear objectives",
    "he drafted the new legislation after consulting with many domain experts",
    "the independent review identified several areas that urgently needed improvement",
    "she summarized the key findings in a concise and readable report",
    "the traveling exhibition attracted curious visitors from around the world",
    "he mentored junior staff and helped them grow professionally",
    "the new research confirmed long-held suspicions about the underlying process",
    "she redesigned the curriculum to meet a wide range of learning needs",
    "the internal audit revealed a significant gap between policy and actual practice",
    "he adjusted his overall strategy after carefully reviewing the quarterly results",
    "the pilot program was extended for another quarter following its early success",
    "she led the investigation with thoroughness and quiet integrity",
    "the detailed proposal included a realistic timeline and a clear budget estimate",
    "he briefed the entire team thoroughly before they entered the field",
    "the analysis highlighted a growing trend that had been completely overlooked",
    "she submitted the application well ahead of the official closing date",
    "the intensive workshop helped participants develop practical communication skills",
    "he coordinated the complex logistics for the three-day international conference",
    "the final outcome exceeded all expectations and strengthened confidence in the approach",
  ],

  hard: [
    "the algorithm uses dynamic programming to optimize overlapping subproblems efficiently",
    "she implemented a self-balancing binary search tree with amortized rotations",
    "the compiler transforms source code into machine-readable bytecode via multiple passes",
    "recursive functions must define a clear base case to prevent stack overflow",
    "the database schema was normalized to third normal form to eliminate redundancy",
    "he configured the stateful firewall to reject unauthorized inbound network packets",
    "the convolutional neural network was trained on millions of labeled image examples",
    "asynchronous programming enables non-blocking execution of concurrent io-bound tasks",
    "the cryptographic hash function produces a fixed-length digest regardless of input size",
    "she refactored the codebase to measurably reduce its cyclomatic complexity score",
    "the operating system kernel manages memory allocation and deallocation transparently",
    "version control systems track every change to source code with full attribution",
    "the load balancer distributes incoming requests across multiple stateless backend nodes",
    "he wrote comprehensive unit tests to verify each function in complete isolation",
    "the middleware intercepts each request before it reaches the controller layer",
    "containerization isolates applications and their dependencies from the host environment",
    "the query optimizer selects the most efficient execution plan based on table statistics",
    "she deployed the application using a fully automated continuous integration pipeline",
    "the distributed system uses a consensus algorithm to maintain replica consistency",
    "message queues decouple producers and consumers in event-driven microservice architecture",
    "the garbage collector reclaims heap memory that is no longer reachable from roots",
    "he debugged the race condition by introducing the appropriate synchronization primitives",
    "the api endpoint returns a paginated response using efficient cursor-based navigation",
    "polymorphism allows distinct classes to fulfill the same interface at runtime",
    "the microservice communicates with its peers through lightweight idempotent rest calls",
    "she optimized the rendering pipeline by eliminating redundant state changes between draws",
    "the stack trace revealed an unhandled null pointer exception in the middleware layer",
    "dependency injection decouples module construction from behavior to improve testability",
    "bandwidth throttling prevents a single greedy client from monopolizing shared resources",
    "she modeled entity relationships carefully before committing to the relational schema",
    "the reverse proxy caches upstream responses to reduce latency for repeated requests",
    "immutable data structures eliminate entire classes of side effects in functional programs",
    "the event loop processes pending callbacks only after the main call stack is clear",
    "he profiled the hot path and discovered the bottleneck was in the serialization layer",
    "the repository pattern separates data access concerns from core business logic",
    "she wrote a deployment script to automate environment-specific configuration file injection",
    "the kernel module was compiled and inserted into the running system without a reboot",
    "memoization caches the results of expensive function calls to eliminate redundant work",
    "the observer pattern lets the subject notify any number of subscribers without coupling",
    "she serialized the nested object graph into a compact length-prefixed binary format",
    "the write-ahead transaction log guarantees atomicity even after a mid-write system crash",
    "he implemented rate limiting using a sliding-window token bucket with redis backing",
    "the service mesh transparently manages routing encryption and observability between services",
    "she ran comparative benchmarks across several sorting algorithms on representative datasets",
    "the type checker enforces key invariants at compile time rather than deferring to runtime",
    "he annotated the public api surface with precise generic parameter and return type bounds",
    "the least-recently-used eviction policy determines which cache entries are removed first",
    "she traced the memory leak to a retained closure that prevented garbage collection",
    "the constraint propagation algorithm prunes the search space before backtracking begins",
    "he registered the authentication middleware before wiring up the protected route handlers",
    "open addressing resolves hash collisions by probing for the next available slot",
    "she configured strict transport security headers and rotated the tls certificate automatically",
    "the finite state machine transitions between modes based on well-defined guard predicates",
    "he decomposed the monolith into loosely coupled bounded contexts communicating over events",
    "the static analyzer enforces consistent code style and detects common logical errors early",
    "she wrote an end-to-end integration test that exercised the entire request pipeline",
    "the feature flag system allows gradual canary rollout without a full redeployment cycle",
    "exponential backoff with jitter prevents thundering-herd retries after a transient failure",
    "the slow query log revealed that most latency originated from a missing composite index",
    "she registered a custom polymorphic deserializer to handle typed discriminated unions",
    "the circuit breaker trips open when the downstream error rate exceeds its threshold",
    "a trie data structure supports prefix-based autocomplete queries in logarithmic time",
    "access control lists define granular permissions at the resource and action level",
    "she extracted the validation logic into a dedicated service layer to simplify testing",
    "columnar storage dramatically improves analytical scan performance on wide sparse tables",
    "he walked the abstract syntax tree to apply source-to-source code transformation rules",
    "the sliding window algorithm computes rolling aggregates efficiently over streaming input",
    "structured logging produces machine-parseable records that are trivially indexed and queried",
    "the online schema migration completed without downtime using a shadow table strategy",
    "he configured the horizontal pod autoscaler to maintain target cpu utilization across nodes",
    "the two-phase commit protocol ensures all participants agree before the transaction finalizes",
  ],

};

/* ----------------------------------------------------------
   generateWords(difficulty, sentenceCount)
   Picks `sentenceCount` sentences from the pool (shuffled,
   no repeats within a pass), strips punctuation, and returns
   a flat word array.
   ---------------------------------------------------------- */
function generateWords(difficulty, sentenceCount) {
  const pool    = SENTENCES[difficulty] || SENTENCES.medium;
  const shuffled = fisherYates([...pool]);

  const words  = [];
  let poolIdx  = 0;

  while (words.length < 1 || poolIdx < Math.min(sentenceCount, shuffled.length)) {
    if (poolIdx >= shuffled.length) {
      // Need more words — reshuffle and go again
      fisherYates(shuffled);
      poolIdx = 0;
    }
    if (poolIdx >= sentenceCount) break;

    const sentence = shuffled[poolIdx++];
    const cleaned  = sentence
      .toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .trim()
      .split(/\s+/)
      .filter(w => w.length > 0);

    words.push(...cleaned);
  }

  return words;
}

function fisherYates(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
