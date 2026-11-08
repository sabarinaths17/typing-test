/* ============================================================
   TYPEFORGE — SENTENCE POOLS
   Each difficulty has 70 sentences. generateWords() picks
   sentences randomly (no repeats within a pass) and returns
   a flat array of words, preserving case and punctuation.
   ============================================================ */

const SENTENCES = {

  easy: [
    "The sun rises in the east at 7:00 every morning.",
    "She found a small cat near the garden gate.",
    "He likes to drink warm tea in the morning.",
    "The old clock on the wall ticked softly.",
    "They went for a long walk on the beach.",
    "Fresh rain makes the whole world smell clean.",
    "She smiled when she heard her favorite song.",
    "The kids built a big tower out of blocks.",
    "A red kite flew high above the trees.",
    "He made a pot of soup for dinner.",
    "The bookshelf was full of colorful old novels.",
    "She left a note on the kitchen counter.",
    "The fire crackled as they sat by the hearth.",
    "Birds sing their best songs at the break of dawn.",
    "He packed his bag and headed to the airport.",
    "The store sells fresh fruit and vegetables every day.",
    "She drew a picture of a horse in the field.",
    "The stars came out one by one as night fell.",
    "They laughed until their sides ached with joy.",
    "A warm breeze drifted through the open window.",
    "The baby slept soundly through the whole storm.",
    "He found his keys under the couch cushion.",
    "She baked a cake for her best friend.",
    "The river ran clear and cold over smooth stones.",
    "They danced to old songs in the living room.",
    "The dog wagged its tail at every stranger.",
    "She read three chapters before falling asleep.",
    "He planted roses along the fence in spring.",
    "The train arrived right on time for once.",
    "She kept a journal and wrote in it each night.",
    "The morning fog lifted slowly from the valley below.",
    "He fixed the leaky tap in the bathroom.",
    "They shared a pizza and talked for hours.",
    "The tree had grown very tall over the past decade.",
    "She called her mother every Sunday morning without fail.",
    "The cat curled up on the warm windowsill.",
    "He rode his bike along the coastal path.",
    "A light snow fell overnight and covered the ground.",
    "She sang softly to herself while making dinner.",
    "They picked berries from the bushes by the stream.",
    "The old dog slept by the fire all day long.",
    "He wrote a letter and sealed it in an envelope.",
    "The flowers bloomed early this year in the garden.",
    "She watched the sunset from the top of the hill.",
    "They built a snowman in the front yard.",
    "The leaves turned gold and red in the fall.",
    "He ordered soup and bread at the small cafe.",
    "She found a coin on the sidewalk and smiled.",
    "The window was open and a cool breeze came through.",
    "They visited the museum and saw ancient paintings.",
    "A small spider spun a web in the corner.",
    "He closed his eyes and listened to the rain.",
    "She arranged the flowers in a tall glass vase.",
    "They sat in the park and watched the clouds drift by.",
    "The smell of coffee filled the whole apartment.",
    "He tossed a coin into the fountain and made a wish.",
    "She wore her favorite blue dress to the party.",
    "The sunset painted the sky in shades of orange and pink.",
    "They rode horses through the open meadow at dusk.",
    "The moon was bright and round last night.",
    "He pushed the door open and stepped inside.",
    "She wrapped the gift and tied a ribbon on top.",
    "The kids ran down the hill laughing out loud.",
    "He opened the window to let the fresh air in.",
    "She made two mugs of hot cocoa and sat down.",
    "The postman left a package on the front step.",
    "They watched the rain fall from the covered porch.",
    "He thanked her for the kind words and help.",
    "A gentle stream ran through the middle of the forest.",
    "She polished her shoes before heading out the door.",
  ],

  medium: [
    "The scientist explained the theory with remarkable clarity.",
    "She organized her thoughts before beginning the presentation.",
    "The ancient city was buried beneath centuries of soil.",
    "He navigated through the dense forest without a map.",
    "They discovered an unexpected solution to the old problem.",
    "The documentary revealed surprising facts about ocean life.",
    "She balanced her work and personal life with great care.",
    "The architect designed a building that caught everyone's eye.",
    "He translated the foreign document with great precision.",
    "A sudden change in weather disrupted their travel plans entirely.",
    "The professor challenged her students to think more independently.",
    "She adapted quickly to the demands of her new role.",
    "The committee reviewed the proposal and approved it unanimously.",
    "He struggled to concentrate with so many distractions around him.",
    "The landscape shifted dramatically as they crossed the border.",
    "She invested years of effort into mastering the new language.",
    "The experiment produced results that nobody had anticipated beforehand.",
    "He returned the borrowed books before the deadline passed.",
    "They renovated the old farmhouse and turned it into a gallery.",
    "The melody lingered in her mind long after the concert ended.",
    "He presented his findings at the international conference last week.",
    "She negotiated a contract that satisfied everyone involved.",
    "The hospital introduced new technology to improve patient care.",
    "He maintained a strict daily schedule to stay productive.",
    "The storm knocked out power across the entire neighborhood.",
    "She volunteered at the shelter every weekend without fail.",
    "The team celebrated loudly after completing the ambitious project.",
    "He analyzed the data carefully and found an unexpected pattern.",
    "She described the experience in vivid detail to her audience.",
    "The film explored complex emotions with unexpected depth and nuance.",
    "He repaired the engine using only the tools he had on hand.",
    "The policy change sparked a wide debate among community members.",
    "She memorized the entire speech the night before delivery.",
    "The expedition crossed the mountain range in freezing conditions.",
    "He contributed generously to the local fundraising campaign.",
    "She recognized the pattern and solved the puzzle in seconds.",
    "The company launched its product to overwhelmingly positive reviews.",
    "He revised the draft several times before submitting the final version.",
    "The river overflowed its banks during the prolonged heavy rainfall.",
    "She maintained her composure despite the completely unexpected criticism.",
    "The library recently acquired a rare collection of historical manuscripts.",
    "He calculated the trajectory and adjusted the equipment accordingly.",
    "She cultivated a strong reputation for honesty and careful work.",
    "The journalist interviewed dozens of witnesses before the story was published.",
    "The agreement was signed after months of careful negotiation.",
    "He reconstructed the entire scene from the limited evidence available.",
    "She developed a new approach to managing and analyzing large datasets.",
    "The sculpture captured motion in a way that felt almost alive.",
    "He scheduled the meeting to accommodate participants across all time zones.",
    "The restoration revealed original details hidden under layers of old paint.",
    "She collaborated closely with engineers to build a scalable platform.",
    "The delegation arrived at the summit with very clear objectives.",
    "He drafted the new legislation after consulting with many domain experts.",
    "The independent review identified several areas that urgently needed improvement.",
    "She summarized the key findings in a concise and readable report.",
    "The traveling exhibition attracted curious visitors from around the world.",
    "He mentored junior staff and helped them grow professionally.",
    "The new research confirmed long-held suspicions about the underlying process.",
    "She redesigned the curriculum to meet a wide range of learning needs.",
    "The internal audit revealed a significant gap between policy and actual practice.",
    "He adjusted his overall strategy after carefully reviewing the quarterly results.",
    "The pilot program was extended for another quarter following its early success.",
    "She led the investigation with thoroughness and quiet integrity.",
    "The detailed proposal included a realistic timeline and a clear budget estimate.",
    "He briefed the entire team thoroughly before they entered the field.",
    "The analysis highlighted a growing trend that had been completely overlooked.",
    "She submitted the application well ahead of the official closing date.",
    "The intensive workshop helped participants develop practical communication skills.",
    "He coordinated the complex logistics for the three-day international conference.",
    "The final outcome exceeded all expectations and strengthened confidence in the approach.",
  ],

  hard: [
    "The algorithm uses dynamic programming to optimize overlapping subproblems efficiently.",
    "She implemented a self-balancing binary search tree with amortized rotations.",
    "The compiler transforms source code into machine-readable bytecode via multiple passes.",
    "Recursive functions must define a clear base case to prevent stack overflow.",
    "The database schema was normalized to third normal form to eliminate redundancy.",
    "He configured the stateful firewall to reject unauthorized inbound network packets.",
    "The convolutional neural network was trained on millions of labeled image examples.",
    "Asynchronous programming enables non-blocking execution of concurrent I/O-bound tasks.",
    "The cryptographic hash function produces a fixed-length digest regardless of input size.",
    "She refactored the codebase to measurably reduce its cyclomatic complexity score.",
    "The operating system kernel manages memory allocation and deallocation transparently.",
    "Version control systems track every change to source code with full attribution.",
    "The load balancer distributes incoming requests across multiple stateless backend nodes.",
    "He wrote comprehensive unit tests to verify each function in complete isolation.",
    "The middleware intercepts each request before it reaches the controller layer.",
    "Containerization isolates applications and their dependencies from the host environment.",
    "The query optimizer selects the most efficient execution plan based on table statistics.",
    "She deployed the application using a fully automated continuous integration pipeline.",
    "The distributed system uses a consensus algorithm to maintain replica consistency.",
    "Message queues decouple producers and consumers in event-driven microservice architecture.",
    "The garbage collector reclaims heap memory that is no longer reachable from roots.",
    "He debugged the race condition by introducing the appropriate synchronization primitives.",
    "The API endpoint returns a paginated response using efficient cursor-based navigation.",
    "Polymorphism allows distinct classes to fulfill the same interface at runtime.",
    "The microservice communicates with its peers through lightweight idempotent REST calls.",
    "She optimized the rendering pipeline by eliminating redundant state changes between draws.",
    "The stack trace revealed an unhandled null pointer exception in the middleware layer.",
    "Dependency injection decouples module construction from behavior to improve testability.",
    "Bandwidth throttling prevents a single greedy client from monopolizing shared resources.",
    "She modeled entity relationships carefully before committing to the relational schema.",
    "The reverse proxy caches upstream responses to reduce latency for repeated requests.",
    "Immutable data structures eliminate entire classes of side effects in functional programs.",
    "The event loop processes pending callbacks only after the main call stack is clear.",
    "He profiled the hot path and discovered the bottleneck was in the serialization layer.",
    "The repository pattern separates data access concerns from core business logic.",
    "She wrote a deployment script to automate environment-specific configuration injection.",
    "The kernel module was compiled and inserted into the running system without a reboot.",
    "Memoization caches the results of expensive function calls to eliminate redundant work.",
    "The observer pattern lets the subject notify any number of subscribers without coupling.",
    "She serialized the nested object graph into a compact length-prefixed binary format.",
    "The write-ahead log guarantees atomicity even after a mid-write system crash.",
    "He implemented rate limiting using a sliding-window token bucket with Redis backing.",
    "The service mesh transparently manages routing, encryption, and observability between services.",
    "She ran comparative benchmarks across several sorting algorithms on representative datasets.",
    "The type checker enforces key invariants at compile time rather than deferring to runtime.",
    "He annotated the public API surface with precise generic parameter and return type bounds.",
    "The least-recently-used eviction policy determines which cache entries are removed first.",
    "She traced the memory leak to a retained closure that prevented garbage collection.",
    "The constraint propagation algorithm prunes the search space before backtracking begins.",
    "He registered the authentication middleware before wiring up the protected route handlers.",
    "Open addressing resolves hash collisions by probing for the next available slot.",
    "She configured strict transport security headers and rotated the TLS certificate automatically.",
    "The finite state machine transitions between modes based on well-defined guard predicates.",
    "He decomposed the monolith into loosely coupled bounded contexts communicating over events.",
    "The static analyzer enforces consistent code style and detects common logical errors early.",
    "She wrote an end-to-end integration test that exercised the entire request pipeline.",
    "The feature flag system allows gradual canary rollout without a full redeployment cycle.",
    "Exponential backoff with jitter prevents thundering-herd retries after a transient failure.",
    "The slow query log revealed that most latency originated from a missing composite index.",
    "She registered a custom polymorphic deserializer to handle typed discriminated unions.",
    "The circuit breaker trips open when the downstream error rate exceeds its threshold.",
    "A trie data structure supports prefix-based autocomplete queries in logarithmic time.",
    "Access control lists define granular permissions at the resource and action level.",
    "She extracted the validation logic into a dedicated service layer to simplify testing.",
    "Columnar storage dramatically improves analytical scan performance on wide sparse tables.",
    "He walked the abstract syntax tree to apply source-to-source code transformation rules.",
    "The sliding window algorithm computes rolling aggregates efficiently over streaming input.",
    "Structured logging produces machine-parseable records that are trivially indexed and queried.",
    "The online schema migration completed without downtime using a shadow table strategy.",
    "He configured the horizontal pod autoscaler to maintain target CPU utilization across nodes.",
    "The two-phase commit protocol ensures all participants agree before the transaction finalizes.",
  ],

};

/* ----------------------------------------------------------
   generateWords(difficulty, sentenceCount)
   Picks `sentenceCount` sentences from the pool (shuffled,
   no repeats within a pass) and returns a flat word array,
   preserving case and punctuation.
   ---------------------------------------------------------- */
function generateWords(difficulty, sentenceCount) {
  const pool     = SENTENCES[difficulty] || SENTENCES.medium;
  const shuffled = fisherYates([...pool]);

  const words  = [];
  let poolIdx  = 0;

  while (words.length < 1 || poolIdx < Math.min(sentenceCount, shuffled.length)) {
    if (poolIdx >= shuffled.length) {
      fisherYates(shuffled);
      poolIdx = 0;
    }
    if (poolIdx >= sentenceCount) break;

    const sentence = shuffled[poolIdx++];
    const cleaned  = sentence
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
