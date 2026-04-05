export const sitTheme12Ar = [
  // ═══════════════════════════════════════════════════════════
  //  THEME 1 — LAÏCITÉ (10 questions)
  // ═══════════════════════════════════════════════════════════

  // S1
  {
    text: "أنت ولي أمر تلميذ. ابنتك البالغة من العمر 14 عامًا ترغب في ارتداء الحجاب في المدرسة الإعدادية الحكومية. يُبلغك المدير أن ذلك ممنوع. ما هو التصرف الصحيح؟",
    explanation: "يحظر قانون 15 مارس 2004 ارتداء الرموز الدينية الظاهرة في المدارس والإعداديات والثانويات الحكومية. ينطبق هذا القانون على جميع التلاميذ وجميع الأديان.",
    choices: [
      { id: 'a' as const, text: "تقبل القاعدة لأن القانون يحظر الرموز الدينية الظاهرة في المدرسة الحكومية" },
      { id: 'b' as const, text: "تقدم شكوى ضد المدير بتهمة التمييز الديني" },
      { id: 'c' as const, text: "تسجّل ابنتك في مدرسة إعدادية حكومية أخرى حيث سيُسمح لها بذلك" },
      { id: 'd' as const, text: "تطلب إعفاءً من مديرية التعليم لأسباب دينية" },
    ],
  },
  // S2
  {
    text: "في العمل، أنت موظف استقبال في البلدية. يطلب منك زميلك أن تحل محله لمدة 15 دقيقة ليتمكن من أداء الصلاة في مكتب فارغ. ماذا تفعل؟",
    explanation: "يخضع موظفو الخدمة العامة لالتزام الحياد الديني. لا يمكن ممارسة الشعائر الدينية خلال وقت العمل. يجب على زميلك انتظار استراحته الشخصية.",
    choices: [
      { id: 'a' as const, text: "توافق تضامنًا بين الزملاء، هذا أمر طبيعي" },
      { id: 'b' as const, text: "ترفض لأن ذلك يعطّل سير العمل، لكنك تذكّره بأنه يمكنه الصلاة أثناء استراحته" },
      { id: 'c' as const, text: "توافق بشرط أن يكون سريعًا" },
      { id: 'd' as const, text: "تُبلغ عن زميلك فورًا للشرطة" },
    ],
  },
  // S3
  {
    text: "ترافق والدتك إلى قسم الطوارئ في مستشفى حكومي. ترفض أن يفحصها طبيب ذكر لأسباب دينية. ما الذي يجب أن تفهمه؟",
    explanation: "في المستشفى الحكومي، لا يمكن للمريض أن يشترط طبيبًا من جنس معين لأسباب دينية. ينظّم المستشفى عمله وفق إمكانياته والحالة الطبية الطارئة لها الأولوية على القناعات الشخصية.",
    choices: [
      { id: 'a' as const, text: "يجب على المستشفى توفير طبيبة حتمًا إذا طلبت المريضة ذلك" },
      { id: 'b' as const, text: "لوالدتك الحق المطلق في رفض أي علاج" },
      { id: 'c' as const, text: "المستشفى غير ملزم بالاستجابة لهذا الطلب؛ العلاج يسبق القناعات الشخصية" },
      { id: 'd' as const, text: "يمكنك تقديم شكوى ضد المستشفى لعدم احترام الحرية الدينية" },
    ],
  },
  // S4
  {
    text: "في مطعم المدرسة الحكومية لطفلك، تطلب أن يُقدَّم طعام حلال بشكل دائم. يرفض المدير. هل هو محق في ذلك؟",
    explanation: "لا يوجد أي التزام قانوني على مطعم المدرسة الحكومية بتقديم وجبات دينية. يقتضي مبدأ العلمانية أن الخدمة العامة لا تتكيف مع التعاليم الدينية، حتى لو اختارت بعض البلديات تقديم وجبات بديلة.",
    choices: [
      { id: 'a' as const, text: "لا، هذا تمييز ضد دينك" },
      { id: 'b' as const, text: "لا، يجب على المدرسة احترام جميع الأديان بتقديم جميع أنواع الوجبات" },
      { id: 'c' as const, text: "نعم، لكن فقط إذا كانت المدرسة تقدم بالفعل وجبة نباتية" },
      { id: 'd' as const, text: "نعم، مطعم المدرسة الحكومية غير ملزم بتقديم وجبات دينية" },
    ],
  },
  // S5
  {
    text: "أنت موظف بلدي. يرغب رئيس البلدية في وضع مجسّم لمغارة عيد الميلاد في بهو البلدية. يعترض أحد المواطنين. ماذا يقول القانون؟",
    explanation: "وفقًا لاجتهاد مجلس الدولة (2016)، يمكن وضع مغارة عيد الميلاد في مبنى عام بشرط أن تكون ذات طابع ثقافي أو فني أو احتفالي، وليست عملاً تبشيريًا دينيًا. السياق المحلي هو المحدد.",
    choices: [
      { id: 'a' as const, text: "ممنوع دائمًا لأنه ينتهك مبدأ العلمانية" },
      { id: 'b' as const, text: "مسموح دائمًا لأن عيد الميلاد جزء من الثقافة الفرنسية" },
      { id: 'c' as const, text: "ممكن إذا كانت المغارة ذات طابع ثقافي أو احتفالي ولا تشكل عملاً تبشيريًا" },
      { id: 'd' as const, text: "مسموح فقط إذا كانت جميع الأديان ممثلة بشكل متساوٍ" },
    ],
  },
  // S6
  {
    text: "أنتِ أم تلميذ وترتدين الحجاب. ترغبين في مرافقة فصل ابنك في رحلة مدرسية. هل يمكن للمدرسة رفضك؟",
    explanation: "الآباء المرافقون في الرحلات المدرسية ليسوا موظفين في الخدمة العامة. أوضح مجلس الدولة أن ارتداء المرافقة للحجاب ليس بحد ذاته سببًا للرفض، إلا إذا أخلّ ذلك بالنظام العام أو حسن سير النشاط.",
    choices: [
      { id: 'a' as const, text: "نعم، قانون 2004 يحظر جميع الرموز الدينية في الإطار المدرسي بما في ذلك الآباء" },
      { id: 'b' as const, text: "لا، لأنكِ كولية أمر مرافقة لستِ خاضعة لالتزام الحياد المفروض على موظفي الخدمة العامة" },
      { id: 'c' as const, text: "نعم، لأنكِ تمثلين المدرسة خلال الرحلة" },
      { id: 'd' as const, text: "لا، لأن الحرية الدينية مطلقة وبدون أي قيود في فرنسا" },
    ],
  },
  // S7
  {
    text: "تم توظيفك حديثًا كموظف حكومي في مصلحة الضرائب. تعتاد على ارتداء صليب كبير حول عنقك. يطلب منك رئيسك نزعه أثناء العمل. هل هو محق؟",
    explanation: "يخضع موظفو الخدمة العامة لالتزام صارم بالحياد الديني. لا يجب عليهم ارتداء أي رمز ديني ظاهر أثناء أداء وظائفهم، مهما كان دينهم.",
    choices: [
      { id: 'a' as const, text: "لا، هذا اعتداء على حريتك الدينية" },
      { id: 'b' as const, text: "نعم، لكن فقط إذا اشتكى المواطنون المراجعون" },
      { id: 'c' as const, text: "لا، لأن الصليب رمز ثقافي وليس دينيًا" },
      { id: 'd' as const, text: "نعم، يجب على الموظفين الحكوميين احترام مبدأ الحياد الديني" },
    ],
  },
  // S8
  {
    text: "تعمل في شركة خاصة. تريد أخذ يوم إجازة لمناسبة عيد ديني ليس من أيام العطل الرسمية. يرفض صاحب العمل. هل هذا قانوني؟",
    explanation: "في القطاع الخاص، يمكن لصاحب العمل أن يأذن بالغياب لأسباب دينية، لكنه غير ملزم بذلك إلا إذا نصت الاتفاقية الجماعية على ذلك. الرفض ليس تمييزيًا إذا كان مبررًا بمتطلبات العمل.",
    choices: [
      { id: 'a' as const, text: "لا، هذا تمييز ديني يحظره القانون" },
      { id: 'b' as const, text: "نعم، يمكن لصاحب العمل الرفض إذا كان ذلك مبررًا بمتطلبات العمل" },
      { id: 'c' as const, text: "لا، يجب على صاحب العمل قبول جميع الأعياد الدينية حتمًا" },
      { id: 'd' as const, text: "نعم، لكن فقط إذا كانت الشركة مؤسسة حكومية" },
    ],
  },
  // S9
  {
    text: "يطلب عدة موظفين في شركتك من الإدارة تخصيص غرفة للصلاة في المقر. ترفض الإدارة. يعتبر الموظفون أن هذا تمييز. من على حق؟",
    explanation: "صاحب العمل الخاص غير ملزم بتوفير مكان للعبادة في الشركة. يمكنه فعل ذلك إذا أراد، لكن رفضه لا يشكل تمييزًا. تُمارَس الحرية الدينية للموظف خارج وقت العمل.",
    choices: [
      { id: 'a' as const, text: "الموظفون، لأن صاحب العمل يجب أن يحترم الحرية الدينية" },
      { id: 'b' as const, text: "الإدارة، لأنه لا يوجد ما يُلزم صاحب العمل بتوفير مكان للعبادة" },
      { id: 'c' as const, text: "الموظفون، إذا كان عددهم كافيًا لتقديم الطلب" },
      { id: 'd' as const, text: "الإدارة، لكن يجب عليها اقتراح بديل خارج المقر" },
    ],
  },
  // S10
  {
    text: "يعود طفلك من المدرسة ويخبرك أن أستاذه شرح في الفصل تاريخ الأديان الكبرى. تعتبر أن هذا ينتهك مبدأ العلمانية. هل أنت محق؟",
    explanation: "العلمانية لا تمنع تدريس الظاهرة الدينية في المدرسة. تعليم تاريخ الأديان ضمن منهج معرفي وثقافي يتوافق تمامًا مع مبدأ العلمانية. المحظور هو التبشير.",
    choices: [
      { id: 'a' as const, text: "نعم، المدرسة الحكومية لا يجب أن تتحدث عن الدين أبدًا" },
      { id: 'b' as const, text: "نعم، إلا إذا تحدث الأستاذ عن جميع الأديان بشكل متساوٍ" },
      { id: 'c' as const, text: "لا، تدريس تاريخ الأديان هو منهج معرفي وليس تبشيرًا" },
      { id: 'd' as const, text: "نعم، فقط الآباء يمكنهم الحديث عن الأديان مع أطفالهم" },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  //  ÉGALITÉ & FRATERNITÉ (10 questions)
  // ═══════════════════════════════════════════════════════════

  // S11
  {
    text: "تتقدم لوظيفة نادل. أثناء المقابلة، يقول لك المسؤول عن التوظيف: «نحن لا نوظف أشخاصًا من أصول أجنبية في مؤسستنا.» ماذا يمكنك أن تفعل؟",
    explanation: "هذا تمييز في التوظيف على أساس الأصل، وهو محظور بموجب قانون العمل والقانون الجنائي. يمكنك اللجوء إلى مُحامي الحقوق أو تقديم شكوى.",
    choices: [
      { id: 'a' as const, text: "لا شيء، من حق صاحب العمل اختيار موظفيه بحرية" },
      { id: 'b' as const, text: "يمكنك اللجوء إلى مُحامي الحقوق أو تقديم شكوى لأن هذا تمييز محظور" },
      { id: 'c' as const, text: "يمكنك فقط كتابة تقييم سلبي على الإنترنت" },
      { id: 'd' as const, text: "يجب عليك أولاً الحصول على الجنسية الفرنسية لتتمكن من التصرف" },
    ],
  },
  // S12
  {
    text: "تبحث عن شقة. يرفض مالك العقار تأجيرك عندما يعلم أنك أم عزباء لديها ثلاثة أطفال. هل هذا قانوني؟",
    explanation: "رفض التأجير بسبب الوضع العائلي يشكل تمييزًا محظورًا قانونيًا. الوضع العائلي من بين معايير التمييز المحظورة بموجب القانون الجنائي (المادة 225-1).",
    choices: [
      { id: 'a' as const, text: "نعم، المالك حر في اختيار مستأجره وفق معاييره" },
      { id: 'b' as const, text: "نعم، لأن له الحق في حماية ممتلكاته" },
      { id: 'c' as const, text: "لا، هذا تمييز على أساس الوضع العائلي، وهو محظور قانونيًا" },
      { id: 'd' as const, text: "لا، لكن فقط إذا كنتِ تحملين الجنسية الفرنسية" },
    ],
  },
  // S13
  {
    text: "جارتك المسنّة تعيش وحيدة وتجد صعوبة في التسوق، خاصة في فصل الشتاء. أي تصرف يجسّد قيمة الأخوّة الجمهورية بشكل أفضل؟",
    explanation: "الأخوّة، المنقوشة في شعار الجمهورية، تعني التضامن بين المواطنين. عرض المساعدة على شخص ضعيف هو فعل أخوّة ملموس.",
    choices: [
      { id: 'a' as const, text: "لا تفعل شيئًا لأن هذا ليس مسؤوليتك" },
      { id: 'b' as const, text: "تعرض عليها مرافقتها أو القيام بتسوّقها من حين لآخر" },
      { id: 'c' as const, text: "تتصل بالخدمات الاجتماعية ليتولوا الأمر بدلاً عنك" },
      { id: 'd' as const, text: "تنصحها بالانتقال إلى دار المسنين" },
    ],
  },
  // S14
  {
    text: "في العمل، تكتشف أن زميلة تشغل نفس المنصب مثلك، بنفس الأقدمية والمؤهلات، تتقاضى أقل منك بنسبة 15%. ماذا يقول القانون؟",
    explanation: "مبدأ «العمل المتساوي، الأجر المتساوي» منصوص عليه في قانون العمل. الفارق في الأجر بين النساء والرجال لنفس المنصب ونفس المؤهلات غير قانوني.",
    choices: [
      { id: 'a' as const, text: "هذا طبيعي، صاحب العمل حر في تحديد الرواتب كما يشاء" },
      { id: 'b' as const, text: "هذا غير قانوني فقط إذا تجاوز الفارق 20%" },
      { id: 'c' as const, text: "يفرض القانون المساواة في الأجر لنفس العمل، وهذا الفارق غير قانوني" },
      { id: 'd' as const, text: "هذا قانوني إذا استطاع صاحب العمل إثبات أن الرجل أكثر إنتاجية" },
    ],
  },
  // S15
  {
    text: "صديقك، أجنبي في وضع نظامي في فرنسا، يُرفض تسجيل طفله في المدرسة الحكومية من قبل المدير الذي يقول إنه «يجب أن يكون فرنسيًا». ما الذي يجب أن تعرفه؟",
    explanation: "التعليم إلزامي لجميع الأطفال المقيمين في فرنسا، بغض النظر عن جنسيتهم أو جنسية آبائهم. رفض التسجيل غير قانوني.",
    choices: [
      { id: 'a' as const, text: "المدير محق، المدرسة الحكومية مخصصة للأطفال الفرنسيين" },
      { id: 'b' as const, text: "المدير مخطئ، كل طفل مقيم في فرنسا له الحق في التعليم بغض النظر عن جنسيته" },
      { id: 'c' as const, text: "المدير محق، لكن يمكن للطفل الالتحاق بمدرسة خاصة" },
      { id: 'd' as const, text: "يجب على الطفل أولاً الحصول على إقامة شخصية" },
    ],
  },
  // S16
  {
    text: "أنت على كرسي متحرك. يرفض مطعم استقبالك بحجة عدم وجود منحدر وأن «الأمر سيكون معقدًا». ماذا يقول القانون؟",
    explanation: "يفرض قانون 11 فبراير 2005 إتاحة الوصول إلى المنشآت المفتوحة للجمهور. رفض استقبال شخص من ذوي الإعاقة يشكل تمييزًا يعاقب عليه القانون.",
    choices: [
      { id: 'a' as const, text: "صاحب المطعم محق، ليس ملزمًا بالتكيف" },
      { id: 'b' as const, text: "صاحب المطعم يرتكب تمييزًا؛ القانون يفرض إتاحة الوصول للأماكن المفتوحة للجمهور" },
      { id: 'c' as const, text: "صاحب المطعم محق إذا كان المبنى قديمًا" },
      { id: 'd' as const, text: "لا يمكنك فعل شيء لأنه لا يوجد أي قانون بشأن إتاحة الوصول" },
    ],
  },
  // S17
  {
    text: "تم فصل زميلك من العمل بعد أن علم صاحب العمل بمثليته الجنسية. هل يمكن لزميلك الطعن في هذا الفصل؟",
    explanation: "الفصل من العمل بسبب التوجه الجنسي هو تمييز محظور بموجب قانون العمل والقانون الجنائي. هذا الفصل باطل ويمكن للموظف اللجوء إلى محكمة العمل.",
    choices: [
      { id: 'a' as const, text: "لا، يمكن لصاحب العمل الفصل لأي سبب يختاره" },
      { id: 'b' as const, text: "نعم، لكن فقط إذا كانت لديه أكثر من سنتين أقدمية" },
      { id: 'c' as const, text: "لا، التوجه الجنسي ليس معيارًا محميًا قانونيًا" },
      { id: 'd' as const, text: "نعم، هذا فصل تمييزي محظور قانونيًا، ويمكنه اللجوء إلى محكمة العمل" },
    ],
  },
  // S18
  {
    text: "في الشارع، ترى شخصًا يتعرض لوعكة صحية. يتجاهله المارة. ما هو التزامك القانوني؟",
    explanation: "في فرنسا، عدم مساعدة شخص في خطر جريمة يعاقب عليها القانون الجنائي (المادة 223-6). كل مواطن ملزم بتقديم المساعدة أو على الأقل الاتصال بخدمات الطوارئ.",
    choices: [
      { id: 'a' as const, text: "ليس عليك أي التزام، إنه خيار شخصي" },
      { id: 'b' as const, text: "يجب أن تتدخل فقط إذا كنت طبيبًا" },
      { id: 'c' as const, text: "أنت ملزم بتقديم المساعدة أو الاتصال بالطوارئ (15 أو 112)" },
      { id: 'd' as const, text: "يجب أن تنتظر حتى يتدخل شخص آخر أولاً" },
    ],
  },
  // S19
  {
    text: "ابنك البالغ من العمر 19 عامًا يرغب في الانخراط في مهمة ذات مصلحة عامة لمساعدة الآخرين. يتردد بين عدة برامج. أي برنامج يتوافق أكثر مع قيمة الأخوّة الجمهورية؟",
    explanation: "الخدمة المدنية تتيح للشباب من 16 إلى 25 عامًا الانخراط في مهام ذات مصلحة عامة (تضامن، تعليم، بيئة). إنها شكل ملموس من الالتزام المواطني مرتبط بالأخوّة.",
    choices: [
      { id: 'a' as const, text: "الخدمة المدنية التي تتيح تنفيذ مهام ذات مصلحة عامة" },
      { id: 'b' as const, text: "العمل في شركة خاصة، لأن العمل هو تضامن" },
      { id: 'c' as const, text: "السفر إلى الخارج لاكتشاف ثقافات أخرى" },
      { id: 'd' as const, text: "الانضمام إلى حزب سياسي" },
    ],
  },
  // S20
  {
    text: "تم استدعاؤك إلى المحكمة لكنك لا تملك المال لدفع أتعاب محامٍ. ماذا توفر الجمهورية لضمان المساواة أمام العدالة؟",
    explanation: "المساعدة القضائية تتيح للأشخاص ذوي الدخل المحدود الاستفادة من تغطية كلية أو جزئية لتكاليف العدالة، بما في ذلك أتعاب المحامي. إنها تطبيق ملموس لمبدأ المساواة.",
    choices: [
      { id: 'a' as const, text: "لا شيء، يجب دفع أتعاب محامٍ أو الدفاع عن نفسك" },
      { id: 'b' as const, text: "المساعدة القضائية تتيح للأشخاص ذوي الدخل المحدود الحصول على محامٍ مجاني" },
      { id: 'c' as const, text: "يمكنك طلب من القاضي إلغاء القضية" },
      { id: 'd' as const, text: "فقط المواطنون الفرنسيون يمكنهم الاستفادة من محامٍ مجاني" },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  //  LIBERTÉ (10 questions)
  // ═══════════════════════════════════════════════════════════

  // S21
  {
    text: "على وسائل التواصل الاجتماعي، ينشر شخص رسالة مهينة ومُهدِّدة تجاه مجتمع ديني. يدافع عن نفسه بالتذرع بحرية التعبير. هل هو محق؟",
    explanation: "حرية التعبير لها حدود في فرنسا. التحريض على الكراهية والتهديدات والإهانات ذات الطابع العنصري أو الديني جرائم يعاقب عليها القانون (قانون 29 يوليو 1881 والقانون الجنائي).",
    choices: [
      { id: 'a' as const, text: "نعم، حرية التعبير مطلقة في فرنسا" },
      { id: 'b' as const, text: "نعم، لأنه على الإنترنت يمكن قول أي شيء" },
      { id: 'c' as const, text: "لا، حرية التعبير لا تحمي التحريض على الكراهية ولا التهديدات" },
      { id: 'd' as const, text: "لا، لكن فقط إذا قدّم الضحية شكوى" },
    ],
  },
  // S22
  {
    text: "ترغب في المشاركة في مظاهرة سلمية ضد إصلاح حكومي. يهددك صاحب العمل بفصلك إذا ذهبت في يوم إجازتك. هل له الحق في ذلك؟",
    explanation: "حق التظاهر السلمي حرية أساسية في فرنسا. لا يمكن لصاحب العمل معاقبة موظف على مشاركته في مظاهرة خارج وقت العمل.",
    choices: [
      { id: 'a' as const, text: "نعم، يمكن لصاحب العمل منع موظفيه من التظاهر" },
      { id: 'b' as const, text: "لا، حق التظاهر حرية أساسية ولا يمكن لصاحب العمل معاقبتك على ذلك" },
      { id: 'c' as const, text: "نعم، إذا كانت المظاهرة ضد الحكومة" },
      { id: 'd' as const, text: "لا، لكن فقط إذا كانت المظاهرة مُصرّح بها لدى المحافظة" },
    ],
  },
  // S23
  {
    text: "تنشر صحيفة مقالاً ينتقد رئيس الجمهورية. يقول لك صديق إن الصحيفة يجب أن تُمنع بسبب عدم الاحترام. ماذا تجيب؟",
    explanation: "حرية الصحافة، المكفولة بقانون 29 يوليو 1881، تسمح بانتقاد الشخصيات السياسية والمؤسسات. إنها ركيزة من ركائز الديمقراطية، طالما لا يتعلق الأمر بالتشهير.",
    choices: [
      { id: 'a' as const, text: "صديقك محق، لا يجب انتقاد الرئيس" },
      { id: 'b' as const, text: "يمكن ملاحقة الصحيفة قضائيًا بتهمة إهانة رئيس الدولة" },
      { id: 'c' as const, text: "الصحافة حرة في انتقاد المسؤولين السياسيين، هذا حق أساسي في الديمقراطية" },
      { id: 'd' as const, text: "يمكن للصحيفة الانتقاد، لكن فقط بموافقة الحكومة" },
    ],
  },
  // S24
  {
    text: "يكتب جارك على وسائل التواصل الاجتماعي أن خبّاز الحي «يبيع طعامًا مسمومًا» دون أي دليل. يريد الخبّاز تقديم شكوى. هل لديه أسباب لذلك؟",
    explanation: "التأكيد علنيًا على وقائع كاذبة تمسّ بشرف شخص ما يشكّل تشهيرًا، وهو جريمة منصوص عليها في قانون 1881. هذا غير محمي بحرية التعبير.",
    choices: [
      { id: 'a' as const, text: "لا، هذه حرية تعبير جارك" },
      { id: 'b' as const, text: "نعم، هذا تشهير لأنه يؤكد وقائع كاذبة تمسّ بشرف الخبّاز" },
      { id: 'c' as const, text: "لا، لأن وسائل التواصل الاجتماعي لا تخضع للقانون" },
      { id: 'd' as const, text: "نعم، لكن فقط إذا استطاع الخبّاز إثبات أن طعامه جيد" },
    ],
  },
  // S25
  {
    text: "ترغب في إنشاء جمعية ثقافية في حيّك لتنظيم فعاليات. ما هي الشروط في فرنسا؟",
    explanation: "حرية تأسيس الجمعيات مكفولة بقانون 1 يوليو 1901. يمكن لأي شخص إنشاء جمعية بتقديم تصريح لدى المحافظة. يكفي شخصان على الأقل ويجب صياغة النظام الأساسي.",
    choices: [
      { id: 'a' as const, text: "يجب الحصول على إذن مسبق من رئيس البلدية" },
      { id: 'b' as const, text: "يكفي تقديم تصريح لدى المحافظة، الإنشاء حر" },
      { id: 'c' as const, text: "يجب أن تكون فرنسي الجنسية لإنشاء جمعية" },
      { id: 'd' as const, text: "يجب جمع عشرة أشخاص على الأقل والحصول على موافقة المحافظ" },
    ],
  },
  // S26
  {
    text: "أثناء تفتيش للشرطة في الشارع، يطلب منك عنصر أمن وثائق هويتك. ليس لديك أي وثيقة معك. ماذا يحدث؟",
    explanation: "في فرنسا، ليس إلزاميًا حمل وثيقة هوية بشكل دائم. لكن أثناء التفتيش، إذا لم تستطع إثبات هويتك، يمكن احتجازك لمدة تصل إلى 4 ساعات للتحقق.",
    choices: [
      { id: 'a' as const, text: "يتم اعتقالك فورًا ووضعك رهن الحراسة النظرية" },
      { id: 'b' as const, text: "تتلقى غرامة تلقائيًا" },
      { id: 'c' as const, text: "يمكن احتجازك للتحقق من الهوية، لكن عدم حمل الوثائق ليس جريمة" },
      { id: 'd' as const, text: "لا يحق للشرطي تفتيشك بدون سبب" },
    ],
  },
  // S27
  {
    text: "يقرر موظفو شركتك الإضراب احتجاجًا على ظروف عمل خطيرة. يهدد صاحب العمل بفصل جميع المضربين. هل هذا قانوني؟",
    explanation: "حق الإضراب حق دستوري في فرنسا. لا يمكن لصاحب العمل فصل موظف بسبب مشاركته في إضراب، إلا في حالة خطأ جسيم مرتكب أثناء الإضراب (عنف، تخريب).",
    choices: [
      { id: 'a' as const, text: "نعم، يمكن لصاحب العمل فصل المضربين لأنهم لا يعملون" },
      { id: 'b' as const, text: "لا، حق الإضراب دستوري والفصل بسبب الإضراب محظور" },
      { id: 'c' as const, text: "نعم، إذا استمر الإضراب أكثر من 48 ساعة" },
      { id: 'd' as const, text: "لا، لكنه يمكنه تخفيض رواتبهم بشكل نهائي" },
    ],
  },
  // S28
  {
    text: "يقوم جارك بتركيب كاميرا مراقبة تصوّر مباشرة مدخل شقتك والممر المشترك. هل لديك حق الطعن؟",
    explanation: "الحق في احترام الحياة الخاصة مكفول بالمادة 9 من القانون المدني. تصوير المساحات المشتركة أو مدخل مسكن الغير دون موافقته يمثّل اعتداءً على الحياة الخاصة. يمكنك المطالبة بإزالة الكاميرا واللجوء إلى القضاء.",
    choices: [
      { id: 'a' as const, text: "لا، لجارك الحق في تصوير الأجزاء المشتركة" },
      { id: 'b' as const, text: "لا، لأن الكاميرا على ملكيته الخاصة" },
      { id: 'c' as const, text: "نعم، لكن فقط إذا كنت مالكًا وليس مستأجرًا" },
      { id: 'd' as const, text: "نعم، هذا اعتداء على حياتك الخاصة ويمكنك المطالبة بإزالة الكاميرا" },
    ],
  },
  // S29
  {
    text: "أنت مدعو لعشاء بين زملاء العمل. يلومك أحد الزملاء على عدم شرب الكحول قائلاً: «في فرنسا، نشرب نخب معًا.» ماذا تجيب؟",
    explanation: "حرية الضمير، المحمية بالدستور، تشمل حق الامتناع عن شرب الكحول، سواء لأسباب شخصية أو دينية أو صحية. لا يمكن إجبار أي شخص على شرب الكحول.",
    choices: [
      { id: 'a' as const, text: "هو محق، يجب التكيف مع التقاليد الفرنسية" },
      { id: 'b' as const, text: "أنت حر في عدم شرب الكحول، هذا خيار شخصي محمي بحرية الضمير" },
      { id: 'c' as const, text: "يجب أن تشرب قليلاً من باب اللباقة حتى لا تُسيء لزملائك" },
      { id: 'd' as const, text: "يجب أن تشرح أسبابك الدينية لتُعفى" },
    ],
  },
  // S30
  {
    text: "خلال نقاش، يؤكد شخص علنًا أن المحرقة لم تحدث أبدًا، متذرعًا بحرية التعبير. ماذا يقول القانون الفرنسي؟",
    explanation: "يحظر قانون غيسو لعام 1990 إنكار المحرقة، أي إنكار وجود الجرائم ضد الإنسانية. هذا غير مشمول بحرية التعبير ويشكّل جريمة جنائية.",
    choices: [
      { id: 'a' as const, text: "هذا مشمول بحرية التعبير حتى لو كان صادمًا" },
      { id: 'b' as const, text: "هذا محظور فقط في وسائل الإعلام وليس في نقاش خاص" },
      { id: 'c' as const, text: "إنكار المحرقة جريمة جنائية في فرنسا وليس محميًا بحرية التعبير" },
      { id: 'd' as const, text: "هذا مسموح إذا قدّم الشخص ذلك كرأي وليس كحقيقة" },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  //  THEME 2 — Système institutionnel (15 questions)
  // ═══════════════════════════════════════════════════════════

  // S31
  {
    text: "إنه يوم الانتخابات البلدية ولا تجد بطاقتك الانتخابية. هل يمكنك التصويت رغم ذلك؟",
    explanation: "البطاقة الانتخابية ليست إلزامية للتصويت. في البلديات التي يزيد عدد سكانها عن 1000 نسمة، تكفي بطاقة هوية. في البلديات الأقل من 1000 نسمة، لا يُطلب أي مستند.",
    choices: [
      { id: 'a' as const, text: "لا، البطاقة الانتخابية ضرورية للتصويت" },
      { id: 'b' as const, text: "نعم، تكفي بطاقة هوية في البلديات التي يزيد عدد سكانها عن 1000 نسمة" },
      { id: 'c' as const, text: "نعم، لكن فقط إذا قدمت تصريحًا على الشرف" },
      { id: 'd' as const, text: "لا، يجب طلب نسخة مكررة من البلدية قبل التصويت" },
    ],
  },
  // S32
  {
    text: "يجب أن تسافر في رحلة عمل يوم الجولة الثانية من الانتخابات الرئاسية. لا تريد أن تفوّت التصويت. ماذا يمكنك أن تفعل؟",
    explanation: "يمكنك منح توكيل لناخب مسجّل في نفس البلدية. يتم الإجراء في مركز الشرطة أو الدرك أو المحكمة القضائية أو عبر الإنترنت على موقع maprocuration.gouv.fr.",
    choices: [
      { id: 'a' as const, text: "يمكنك التصويت بالمراسلة عن طريق إرسال ورقة التصويت بالبريد" },
      { id: 'b' as const, text: "لا يمكنك فعل شيء، يجب أن تكون حاضرًا شخصيًا" },
      { id: 'c' as const, text: "يمكنك إعداد توكيل ليصوّت ناخب آخر نيابة عنك" },
      { id: 'd' as const, text: "يمكنك التصويت إلكترونيًا على موقع الحكومة" },
    ],
  },
  // S33
  {
    text: "حصلت للتو على الجنسية الفرنسية وترغب في التصويت في الانتخابات القادمة. ما هو الإجراء الأول الضروري؟",
    explanation: "للتمكن من التصويت في فرنسا، يجب التسجيل في القوائم الانتخابية. يمكن التسجيل في البلدية أو عبر الإنترنت، أو يتم تلقائيًا عند بلوغ 18 عامًا للمولودين في فرنسا. المواطنون الجدد يجب عليهم التسجيل.",
    choices: [
      { id: 'a' as const, text: "تُسجَّل تلقائيًا عند الحصول على الجنسية" },
      { id: 'b' as const, text: "يجب عليك التسجيل في القوائم الانتخابية لبلديتك" },
      { id: 'c' as const, text: "يجب الانتظار خمس سنوات بعد التجنس للتمكن من التصويت" },
      { id: 'd' as const, text: "يجب الحصول على إذن خاص من المحافظ" },
    ],
  },
  // S34
  {
    text: "في مكتب التصويت، تلاحظ أن ناخبًا يأخذ مباشرة ورقة تصويت واحدة دون المرور بغرفة الاقتراع السرية. يطلب منه المراقب المرور بالغرفة. هل المراقب محق؟",
    explanation: "المرور بغرفة الاقتراع السرية إلزامي لضمان سرية التصويت. حتى لو لم يرغب الناخب في إخفاء اختياره، فإن المرور بالغرفة خطوة إلزامية في عملية التصويت في فرنسا.",
    choices: [
      { id: 'a' as const, text: "لا، المرور بغرفة الاقتراع السرية اختياري" },
      { id: 'b' as const, text: "نعم، المرور بغرفة الاقتراع السرية إلزامي لضمان سرية التصويت" },
      { id: 'c' as const, text: "لا، المغلف المغلق وحده يضمن سرية التصويت" },
      { id: 'd' as const, text: "نعم، لكن فقط في الانتخابات الرئاسية" },
    ],
  },
  // S35
  {
    text: "جارك من الجنسية البرتغالية ويعيش في فرنسا منذ 10 سنوات. يرغب في التصويت في الانتخابات. في أي انتخابات يمكنه المشاركة؟",
    explanation: "يمكن لمواطني الاتحاد الأوروبي المقيمين في فرنسا التصويت في الانتخابات البلدية والانتخابات الأوروبية، لكن ليس في الانتخابات الرئاسية أو التشريعية أو الجهوية.",
    choices: [
      { id: 'a' as const, text: "في جميع الانتخابات، لأنه يعيش في فرنسا منذ أكثر من 5 سنوات" },
      { id: 'b' as const, text: "في أي انتخابات، لأنه لا يملك الجنسية الفرنسية" },
      { id: 'c' as const, text: "في الانتخابات البلدية والأوروبية فقط" },
      { id: 'd' as const, text: "في الانتخابات الأوروبية فقط" },
    ],
  },
  // S36
  {
    text: "ترغب في الزواج مدنيًا في فرنسا. إلى من يجب أن تتوجه لإتمام الزواج؟",
    explanation: "في فرنسا، الزواج المدني وحده له قيمة قانونية. يُقام في البلدية من قبل رئيس البلدية أو نائبه. الزواج الديني ليس له أي قيمة قانونية إذا لم يسبقه زواج مدني.",
    choices: [
      { id: 'a' as const, text: "إلى كاتب عدل يوثّق الزواج" },
      { id: 'b' as const, text: "إلى رئيس البلدية أو نائبه في بلديتك" },
      { id: 'c' as const, text: "إلى المحكمة القضائية في مدينتك" },
      { id: 'd' as const, text: "إلى محافظ الإقليم" },
    ],
  },
  // S37
  {
    text: "ترغب في بناء توسعة لمنزلك. يخبرك جارك أنه يجب طلب رخصة بناء. إلى من يجب أن تتوجه؟",
    explanation: "يجب تقديم طلبات رخص البناء في بلدية المنطقة التي يقع فيها الأرض. رئيس البلدية هو من يمنح تراخيص التعمير باسم البلدية.",
    choices: [
      { id: 'a' as const, text: "إلى محافظة الإقليم" },
      { id: 'b' as const, text: "إلى بلدية منطقتك" },
      { id: 'c' as const, text: "إلى المجلس الجهوي" },
      { id: 'd' as const, text: "مباشرة إلى وزارة الإسكان" },
    ],
  },
  // S38
  {
    text: "طفلك يبلغ 3 سنوات وترغب في تسجيله في المدرسة التمهيدية الحكومية. ما هو إجراؤك الأول؟",
    explanation: "التسجيل في المدرسة التمهيدية الحكومية يتم أولاً في بلدية منطقتك. تحدد لك البلدية المدرسة المخصصة لمنطقتك، ثم تُتمّ التسجيل لدى مدير المدرسة.",
    choices: [
      { id: 'a' as const, text: "تذهب مباشرة إلى المدرسة التي تختارها لتسجيل طفلك" },
      { id: 'b' as const, text: "تسجّل أولاً في البلدية التي تحدد لك المدرسة المخصصة لمنطقتك" },
      { id: 'c' as const, text: "تتصل بمديرية التعليم في أكاديميتك" },
      { id: 'd' as const, text: "تنتظر رسالة تلقائية من وزارة التربية والتعليم" },
    ],
  },
  // S39
  {
    text: "ترغب في حضور جلسة للمجلس البلدي في بلديتك لمعرفة كيف يُنفَق الميزانية. هل لك الحق في ذلك؟",
    explanation: "جلسات المجلس البلدي علنية (إلا في حالات استثنائية للجلسة المغلقة). يمكن لأي مواطن حضورها. المداولات متاحة أيضًا للاطلاع في البلدية. هذا مبدأ من مبادئ الشفافية الديمقراطية.",
    choices: [
      { id: 'a' as const, text: "لا، فقط المنتخبون والصحفيون يمكنهم حضور الجلسات" },
      { id: 'b' as const, text: "نعم، جلسات المجلس البلدي علنية ومفتوحة للجميع" },
      { id: 'c' as const, text: "نعم، لكن فقط إذا قدمت طلبًا كتابيًا لرئيس البلدية" },
      { id: 'd' as const, text: "لا، الميزانية وثيقة سرية" },
    ],
  },
  // S40
  {
    text: "جدك المسن يحتاج إلى منحة الاستقلالية الشخصية (APA) لتمويل المساعدة المنزلية. إلى أي جماعة محلية يجب التوجه؟",
    explanation: "العمل الاجتماعي، وخاصة منحة الاستقلالية الشخصية (APA) ومنحة التضامن الفعّال (RSA)، من اختصاصات المحافظة (المجلس الإقليمي). هذه من أبرز مهام المحافظات.",
    choices: [
      { id: 'a' as const, text: "إلى بلدية منطقتك" },
      { id: 'b' as const, text: "إلى المجلس الإقليمي، لأن العمل الاجتماعي من اختصاص المحافظة" },
      { id: 'c' as const, text: "إلى صندوق التعويضات العائلية (CAF)" },
      { id: 'd' as const, text: "إلى المجلس الجهوي" },
    ],
  },
  // S41
  {
    text: "تريد الحكومة زيادة الضرائب. يقول لك صديق إن رئيس الوزراء يمكنه فعل ذلك بمفرده بمرسوم. هل هذا صحيح؟",
    explanation: "في فرنسا، البرلمان وحده (الجمعية الوطنية ومجلس الشيوخ) هو من يملك سلطة التصويت على القوانين، بما فيها المتعلقة بالضرائب. هذا مبدأ الفصل بين السلطات: الحكومة تقترح والبرلمان يقرر.",
    choices: [
      { id: 'a' as const, text: "نعم، يمكن لرئيس الوزراء تعديل الضرائب بمرسوم" },
      { id: 'b' as const, text: "لا، رئيس الجمهورية وحده يمكنه زيادة الضرائب" },
      { id: 'c' as const, text: "لا، البرلمان وحده يمكنه التصويت على القوانين الضريبية، هذا مبدأ الفصل بين السلطات" },
      { id: 'd' as const, text: "نعم، إذا وافق المجلس الدستوري" },
    ],
  },
  // S42
  {
    text: "يصوّت البرلمان على قانون يعتبره مواطنون ماسًّا بحرية التعبير. هل يمكن للمواطنين الطعن في هذا القانون وكيف؟",
    explanation: "منذ عام 2010، يمكن لأي متقاضٍ إثارة مسألة أولوية الدستورية (QPC) أمام محكمة. يتحقق المجلس الدستوري عندها من أن القانون يحترم الحقوق والحريات المكفولة بالدستور.",
    choices: [
      { id: 'a' as const, text: "لا، قانون صوّت عليه البرلمان لا يمكن الطعن فيه أبدًا" },
      { id: 'b' as const, text: "نعم، بتقديم عريضة لرئيس الجمهورية" },
      { id: 'c' as const, text: "نعم، بإثارة مسألة أولوية الدستورية (QPC) أمام محكمة" },
      { id: 'd' as const, text: "نعم، بتنظيم استفتاء شعبي" },
    ],
  },
  // S43
  {
    text: "على التلفزيون، تعلم أن رئيس الجمهورية حلّ الجمعية الوطنية ودعا إلى انتخابات جديدة. يقول صديق إن هذا انقلاب. هل هو محق؟",
    explanation: "حق حل الجمعية الوطنية سلطة خاصة برئيس الجمهورية منصوص عليها في المادة 12 من الدستور. إنه إجراء دستوري وليس انقلابًا.",
    choices: [
      { id: 'a' as const, text: "نعم، الرئيس ليس له الحق في حل الجمعية" },
      { id: 'b' as const, text: "لا، الحل سلطة دستورية للرئيس منصوص عليها في المادة 12" },
      { id: 'c' as const, text: "نعم، إلا إذا وافق رئيس الوزراء" },
      { id: 'd' as const, text: "لا، لكن ذلك يتطلب تصويتًا مؤيدًا من مجلس الشيوخ" },
    ],
  },
  // S44
  {
    text: "أنت أجنبي في وضع نظامي وتنتهي صلاحية إقامتك خلال شهرين. أين يجب تقديم طلب التجديد؟",
    explanation: "يتم تجديد بطاقات الإقامة لدى المحافظة أو المحافظة الفرعية للإقليم الذي تقيم فيه. يجب تقديم الطلب قبل انتهاء صلاحية البطاقة الحالية.",
    choices: [
      { id: 'a' as const, text: "في بلدية منطقتك" },
      { id: 'b' as const, text: "في قنصلية بلدك الأصلي" },
      { id: 'c' as const, text: "في المحافظة أو المحافظة الفرعية لإقليم إقامتك" },
      { id: 'd' as const, text: "في وزارة الداخلية في باريس" },
    ],
  },
  // S45
  {
    text: "تعتقد أنك ضحية تمييز من طرف خدمة عامة ولا تعرف إلى من تلجأ. ما هي المؤسسة المستقلة التي يمكنها مساعدتك مجانًا؟",
    explanation: "مُحامي الحقوق هو سلطة دستورية مستقلة مكلفة بمكافحة التمييز والدفاع عن حقوق مستخدمي الخدمات العامة وحماية حقوق الأطفال. اللجوء إليه مجاني.",
    choices: [
      { id: 'a' as const, text: "وسيط البنك الذي تتعامل معه" },
      { id: 'b' as const, text: "مُحامي الحقوق، السلطة المستقلة المكلفة بمكافحة التمييز" },
      { id: 'c' as const, text: "النائب البرلماني عن دائرتك" },
      { id: 'd' as const, text: "المدعي العام، وهو الوحيد المختص" },
    ],
  },
];

export const sitTheme12Es = [
  // ═══════════════════════════════════════════════════════════
  //  THEME 1 — LAICIDAD (10 preguntas)
  // ═══════════════════════════════════════════════════════════

  // S1
  {
    text: "Usted es padre de un alumno. Su hija de 14 anos desea usar un velo islamico en la escuela secundaria publica. El director le informa que esta prohibido. Cual es la actitud correcta?",
    explanation: "La ley del 15 de marzo de 2004 prohibe el uso de simbolos religiosos ostensibles en las escuelas primarias, secundarias y preparatorias publicas. Esta ley se aplica a todos los alumnos y a todas las religiones.",
    choices: [
      { id: 'a' as const, text: "Acepta la regla porque la ley prohibe los simbolos religiosos ostensibles en la escuela publica" },
      { id: 'b' as const, text: "Presenta una denuncia contra el director por discriminacion religiosa" },
      { id: 'c' as const, text: "Inscribe a su hija en otra escuela publica donde estara permitido" },
      { id: 'd' as const, text: "Solicita una exencion al rectorado por motivos religiosos" },
    ],
  },
  // S2
  {
    text: "En el trabajo, usted es recepcionista en un ayuntamiento. Un colega le pide que lo reemplace durante 15 minutos para poder hacer su oracion en una oficina vacia. Que hace usted?",
    explanation: "Los agentes del servicio publico estan sujetos a una obligacion de neutralidad religiosa. La practica religiosa no puede ejercerse durante el horario de servicio. Su colega debe esperar su descanso personal.",
    choices: [
      { id: 'a' as const, text: "Acepta por solidaridad entre colegas, es normal" },
      { id: 'b' as const, text: "Rechaza porque eso interrumpe el servicio, pero le recuerda que puede orar durante su descanso" },
      { id: 'c' as const, text: "Acepta con la condicion de que sea rapido" },
      { id: 'd' as const, text: "Denuncia inmediatamente a su colega ante la policia" },
    ],
  },
  // S3
  {
    text: "Acompana a su madre a urgencias de un hospital publico. Ella se niega a ser examinada por un medico hombre por razones religiosas. Que debe entender usted?",
    explanation: "En un hospital publico, el paciente no puede exigir un medico de un sexo en particular por motivos religiosos. El hospital se organiza segun sus recursos y la urgencia medica tiene prioridad sobre las convicciones personales.",
    choices: [
      { id: 'a' as const, text: "El hospital debe obligatoriamente proporcionar una medica si la paciente lo solicita" },
      { id: 'b' as const, text: "Su madre tiene el derecho absoluto de rechazar cualquier atencion" },
      { id: 'c' as const, text: "El hospital no esta obligado a acceder a esta solicitud; la atencion medica prevalece sobre las convicciones personales" },
      { id: 'd' as const, text: "Puede presentar una denuncia contra el hospital por no respetar la libertad religiosa" },
    ],
  },
  // S4
  {
    text: "En el comedor de la escuela publica de su hijo, usted solicita que se ofrezca sistematicamente un menu halal. El director se niega. Tiene derecho a hacerlo?",
    explanation: "El comedor escolar publico no tiene ninguna obligacion legal de ofrecer menus confesionales. El principio de laicidad implica que el servicio publico no se adapta a las prescripciones religiosas, aunque algunos municipios opten por ofrecer menus alternativos.",
    choices: [
      { id: 'a' as const, text: "No, es una discriminacion contra su religion" },
      { id: 'b' as const, text: "No, la escuela debe respetar todas las religiones ofreciendo todos los menus" },
      { id: 'c' as const, text: "Si, pero unicamente si la escuela ya ofrece un menu vegetariano" },
      { id: 'd' as const, text: "Si, el comedor publico no tiene la obligacion de ofrecer menus confesionales" },
    ],
  },
  // S5
  {
    text: "Usted es empleado municipal. El alcalde desea instalar un pesebre navideno en el vestibulo del ayuntamiento. Un ciudadano protesta. Que dice la ley?",
    explanation: "Segun la jurisprudencia del Consejo de Estado (2016), un pesebre navideno puede instalarse en un edificio publico siempre que tenga un caracter cultural, artistico o festivo, y no constituya un acto de proselitismo religioso. El contexto local es determinante.",
    choices: [
      { id: 'a' as const, text: "Siempre esta prohibido porque viola la laicidad" },
      { id: 'b' as const, text: "Siempre esta permitido porque la Navidad forma parte de la cultura francesa" },
      { id: 'c' as const, text: "Es posible si el pesebre tiene un caracter cultural o festivo y no constituye un acto de proselitismo" },
      { id: 'd' as const, text: "Esta permitido unicamente si todas las religiones estan igualmente representadas" },
    ],
  },
  // S6
  {
    text: "Usted es madre de un alumno y usa velo. Desea acompanar la clase de su hijo en una salida escolar. Puede la escuela negarle la participacion?",
    explanation: "Los padres acompanantes de salidas escolares no son agentes del servicio publico. El Consejo de Estado preciso que el uso del velo por una acompanante no es en si un motivo de rechazo, salvo si perturba el orden publico o el buen desarrollo de la actividad.",
    choices: [
      { id: 'a' as const, text: "Si, la ley de 2004 prohibe todo simbolo religioso en el ambito escolar, incluso para los padres" },
      { id: 'b' as const, text: "No, como padre acompanante no esta sujeta a la obligacion de neutralidad de los agentes publicos" },
      { id: 'c' as const, text: "Si, porque usted representa a la escuela durante la salida" },
      { id: 'd' as const, text: "No, porque la libertad religiosa es absoluta y sin ningun limite en Francia" },
    ],
  },
  // S7
  {
    text: "Acaba de ser contratado como funcionario en una oficina de impuestos. Suele llevar una cruz grande alrededor del cuello. Su superior le pide que se la quite durante el servicio. Tiene razon?",
    explanation: "Los agentes del servicio publico estan sujetos a una estricta neutralidad religiosa. No deben portar ningun simbolo religioso ostensible durante el ejercicio de sus funciones, sin importar su religion.",
    choices: [
      { id: 'a' as const, text: "No, es un atentado contra su libertad religiosa" },
      { id: 'b' as const, text: "Si, pero unicamente si los usuarios se quejan" },
      { id: 'c' as const, text: "No, porque la cruz es un simbolo cultural y no religioso" },
      { id: 'd' as const, text: "Si, los agentes publicos deben respetar el principio de neutralidad religiosa" },
    ],
  },
  // S8
  {
    text: "Trabaja en una empresa privada. Desea tomar un dia libre por una festividad religiosa que no es un dia feriado oficial. Su empleador se niega. Es legal?",
    explanation: "En el sector privado, el empleador puede autorizar una ausencia por motivos religiosos, pero no esta obligado a hacerlo salvo que el convenio colectivo lo prevea. La negativa no es discriminatoria si esta justificada por las necesidades del servicio.",
    choices: [
      { id: 'a' as const, text: "No, es una discriminacion religiosa prohibida por la ley" },
      { id: 'b' as const, text: "Si, el empleador puede negarse si esta justificado por las necesidades del servicio" },
      { id: 'c' as const, text: "No, el empleador debe aceptar obligatoriamente todas las festividades religiosas" },
      { id: 'd' as const, text: "Si, pero unicamente si la empresa es una institucion publica" },
    ],
  },
  // S9
  {
    text: "Varios empleados de su empresa piden a la direccion que habilite una sala de oracion en las instalaciones. La direccion se niega. Los empleados consideran que es discriminatorio. Quien tiene razon?",
    explanation: "El empleador privado no tiene ninguna obligacion de habilitar un lugar de culto en la empresa. Puede hacerlo si lo desea, pero su negativa no constituye discriminacion. La libertad religiosa del empleado se ejerce fuera del horario de trabajo.",
    choices: [
      { id: 'a' as const, text: "Los empleados, porque el empleador debe respetar la libertad religiosa" },
      { id: 'b' as const, text: "La direccion, porque nada obliga a un empleador a proporcionar un lugar de culto" },
      { id: 'c' as const, text: "Los empleados, si son suficientemente numerosos para solicitarlo" },
      { id: 'd' as const, text: "La direccion, pero debe proponer una alternativa fuera de las instalaciones" },
    ],
  },
  // S10
  {
    text: "Su hijo regresa de la escuela y le cuenta que su profesor explico en clase la historia de las grandes religiones. Usted considera que eso viola la laicidad. Tiene razon?",
    explanation: "La laicidad no prohibe la ensenanza del hecho religioso en la escuela. Ensenar la historia de las religiones con un enfoque de conocimiento y cultura es perfectamente compatible con el principio de laicidad. Lo que esta prohibido es el proselitismo.",
    choices: [
      { id: 'a' as const, text: "Si, la escuela publica nunca debe hablar de religion" },
      { id: 'b' as const, text: "Si, salvo que el profesor hable de todas las religiones de manera igualitaria" },
      { id: 'c' as const, text: "No, ensenar la historia de las religiones es un enfoque de conocimiento, no proselitismo" },
      { id: 'd' as const, text: "Si, solo los padres pueden hablar de religiones con sus hijos" },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  //  IGUALDAD Y FRATERNIDAD (10 preguntas)
  // ═══════════════════════════════════════════════════════════

  // S11
  {
    text: "Se postula para un empleo de mesero. Durante la entrevista, el reclutador le dice: \"No contratamos personas de origen extranjero en nuestro establecimiento.\" Que puede hacer?",
    explanation: "Se trata de una discriminacion en la contratacion basada en el origen, prohibida por el Codigo del Trabajo y el Codigo Penal. Puede acudir al Defensor de los Derechos o presentar una denuncia.",
    choices: [
      { id: 'a' as const, text: "Nada, es derecho del empleador elegir libremente a sus empleados" },
      { id: 'b' as const, text: "Puede acudir al Defensor de los Derechos o presentar una denuncia porque es una discriminacion prohibida" },
      { id: 'c' as const, text: "Solo puede escribir una resena negativa en Internet" },
      { id: 'd' as const, text: "Primero debe obtener la nacionalidad francesa para poder actuar" },
    ],
  },
  // S12
  {
    text: "Busca un departamento. Un propietario se niega a alquilarle su inmueble al enterarse de que usted es madre soltera con tres hijos. Es legal?",
    explanation: "Negar un alquiler por la situacion familiar constituye una discriminacion prohibida por la ley. La situacion familiar forma parte de los criterios de discriminacion proscritos por el Codigo Penal (articulo 225-1).",
    choices: [
      { id: 'a' as const, text: "Si, el propietario es libre de elegir a su inquilino segun sus criterios" },
      { id: 'b' as const, text: "Si, porque tiene derecho a proteger su propiedad" },
      { id: 'c' as const, text: "No, es una discriminacion basada en la situacion familiar, prohibida por la ley" },
      { id: 'd' as const, text: "No, pero unicamente si tiene la nacionalidad francesa" },
    ],
  },
  // S13
  {
    text: "Su vecina anciana vive sola y tiene dificultades para hacer sus compras, sobre todo en invierno. Que actitud refleja mejor el valor de fraternidad republicana?",
    explanation: "La fraternidad, inscrita en el lema de la Republica, implica la solidaridad entre ciudadanos. Ofrecer ayuda a una persona vulnerable es un acto concreto de fraternidad.",
    choices: [
      { id: 'a' as const, text: "No hace nada porque no es su responsabilidad" },
      { id: 'b' as const, text: "Le ofrece acompanarla o hacer sus compras de vez en cuando" },
      { id: 'c' as const, text: "Llama a los servicios sociales para que se encarguen en su lugar" },
      { id: 'd' as const, text: "Le aconseja mudarse a una residencia para adultos mayores" },
    ],
  },
  // S14
  {
    text: "En el trabajo, descubre que una colega mujer que ocupa el mismo puesto que usted, con la misma antiguedad y las mismas calificaciones, gana un 15% menos que usted. Que dice la ley?",
    explanation: "El principio de \"a trabajo igual, salario igual\" esta establecido en el Codigo del Trabajo. La diferencia salarial entre mujeres y hombres para el mismo puesto y calificaciones equivalentes es ilegal.",
    choices: [
      { id: 'a' as const, text: "Es normal, el empleador es libre de fijar los salarios como quiera" },
      { id: 'b' as const, text: "Es ilegal unicamente si la diferencia supera el 20%" },
      { id: 'c' as const, text: "La ley impone la igualdad de remuneracion por el mismo trabajo, esta diferencia es ilegal" },
      { id: 'd' as const, text: "Es legal si el empleador puede demostrar que el hombre es mas productivo" },
    ],
  },
  // S15
  {
    text: "Su amigo, extranjero en situacion regular en Francia, ve rechazada la inscripcion de su hijo en la escuela publica por el director que dice que \"hay que ser frances\". Que debe saber?",
    explanation: "La instruccion es obligatoria para todos los ninos que residen en Francia, sin importar su nacionalidad ni la de sus padres. El rechazo de inscripcion es ilegal.",
    choices: [
      { id: 'a' as const, text: "El director tiene razon, la escuela publica esta reservada a los ninos franceses" },
      { id: 'b' as const, text: "El director se equivoca, todo nino que resida en Francia tiene derecho a la educacion, sin importar su nacionalidad" },
      { id: 'c' as const, text: "El director tiene razon, pero el nino puede ir a una escuela privada" },
      { id: 'd' as const, text: "El nino debe primero obtener un permiso de residencia personal" },
    ],
  },
  // S16
  {
    text: "Usted esta en silla de ruedas. Un restaurante se niega a recibirlo argumentando que no tiene rampa de acceso y que \"seria complicado\". Que dice la ley?",
    explanation: "La ley del 11 de febrero de 2005 impone la accesibilidad de los establecimientos abiertos al publico. Negar el acceso a una persona con discapacidad constituye una discriminacion penada por la ley.",
    choices: [
      { id: 'a' as const, text: "El dueno del restaurante esta en su derecho, no tiene obligacion de adaptarse" },
      { id: 'b' as const, text: "El dueno del restaurante comete una discriminacion; la ley impone la accesibilidad de los lugares abiertos al publico" },
      { id: 'c' as const, text: "El dueno del restaurante esta en su derecho si el edificio es antiguo" },
      { id: 'd' as const, text: "No puede hacer nada porque no existe ninguna ley sobre accesibilidad" },
    ],
  },
  // S17
  {
    text: "Su colega es despedido despues de que su empleador se entero de su homosexualidad. Puede su colega impugnar este despido?",
    explanation: "El despido basado en la orientacion sexual es una discriminacion prohibida por el Codigo del Trabajo y el Codigo Penal. Este despido es nulo y el empleado puede acudir al tribunal laboral.",
    choices: [
      { id: 'a' as const, text: "No, el empleador puede despedir por el motivo que desee" },
      { id: 'b' as const, text: "Si, pero unicamente si tiene mas de dos anos de antiguedad" },
      { id: 'c' as const, text: "No, la orientacion sexual no es un criterio protegido por la ley" },
      { id: 'd' as const, text: "Si, es un despido discriminatorio prohibido por la ley, puede acudir al tribunal laboral" },
    ],
  },
  // S18
  {
    text: "En la calle, ve a una persona que sufre un desmayo. Los transeuntes la ignoran. Cual es su obligacion legal?",
    explanation: "En Francia, la omision de socorro a una persona en peligro es un delito penado por el Codigo Penal (articulo 223-6). Todo ciudadano tiene la obligacion de prestar asistencia o al menos llamar a los servicios de emergencia.",
    choices: [
      { id: 'a' as const, text: "No tiene ninguna obligacion, es una eleccion personal" },
      { id: 'b' as const, text: "Solo debe intervenir si es medico" },
      { id: 'c' as const, text: "Tiene la obligacion de prestar asistencia o llamar a emergencias (15 o 112)" },
      { id: 'd' as const, text: "Debe esperar a que otra persona intervenga primero" },
    ],
  },
  // S19
  {
    text: "Su hijo de 19 anos desea comprometerse en una mision de interes general para ayudar a los demas. Duda entre varios programas. Cual programa corresponde mejor al valor de fraternidad republicana?",
    explanation: "El Servicio Civico permite a los jovenes de 16 a 25 anos comprometerse en misiones de interes general (solidaridad, educacion, medio ambiente). Es una forma concreta de compromiso ciudadano vinculada a la fraternidad.",
    choices: [
      { id: 'a' as const, text: "El Servicio Civico, que permite realizar misiones de interes general" },
      { id: 'b' as const, text: "Un empleo en una empresa privada, porque trabajar es ser solidario" },
      { id: 'c' as const, text: "Un viaje al extranjero para descubrir otras culturas" },
      { id: 'd' as const, text: "La inscripcion en un partido politico" },
    ],
  },
  // S20
  {
    text: "Es citado al tribunal pero no tiene los medios para pagar un abogado. Que prevee la Republica para garantizar la igualdad ante la justicia?",
    explanation: "La asistencia juridica permite a las personas de bajos ingresos beneficiarse de una cobertura total o parcial de los gastos judiciales, incluidos los honorarios del abogado. Es una aplicacion concreta del principio de igualdad.",
    choices: [
      { id: 'a' as const, text: "Nada, hay que pagar un abogado o defenderse solo" },
      { id: 'b' as const, text: "La asistencia juridica permite a las personas de bajos ingresos tener un abogado gratuito" },
      { id: 'c' as const, text: "Puede pedir al juez que anule el caso" },
      { id: 'd' as const, text: "Solo los ciudadanos franceses pueden beneficiarse de un abogado gratuito" },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  //  LIBERTAD (10 preguntas)
  // ═══════════════════════════════════════════════════════════

  // S21
  {
    text: "En las redes sociales, un usuario publica un mensaje insultante y amenazante hacia una comunidad religiosa. Se defiende invocando la libertad de expresion. Tiene razon?",
    explanation: "La libertad de expresion tiene limites en Francia. La incitacion al odio, las amenazas y los insultos de caracter racial o religioso son delitos penados por la ley (ley del 29 de julio de 1881 y Codigo Penal).",
    choices: [
      { id: 'a' as const, text: "Si, la libertad de expresion es absoluta en Francia" },
      { id: 'b' as const, text: "Si, porque en Internet se puede decir lo que se quiera" },
      { id: 'c' as const, text: "No, la libertad de expresion no protege la incitacion al odio ni las amenazas" },
      { id: 'd' as const, text: "No, pero unicamente si la victima presenta una denuncia" },
    ],
  },
  // S22
  {
    text: "Desea participar en una manifestacion pacifica contra una reforma del gobierno. Su empleador amenaza con despedirlo si asiste en su dia libre. Tiene derecho a hacerlo?",
    explanation: "El derecho a manifestarse pacificamente es una libertad fundamental en Francia. El empleador no puede sancionar a un empleado por participar en una manifestacion fuera del horario de trabajo.",
    choices: [
      { id: 'a' as const, text: "Si, el empleador puede prohibir a sus empleados manifestarse" },
      { id: 'b' as const, text: "No, el derecho a manifestarse es una libertad fundamental y su empleador no puede sancionarlo por ello" },
      { id: 'c' as const, text: "Si, si la manifestacion es contra el gobierno" },
      { id: 'd' as const, text: "No, pero unicamente si la manifestacion esta declarada ante la prefectura" },
    ],
  },
  // S23
  {
    text: "Un periodico publica un articulo critico hacia el presidente de la Republica. Un amigo le dice que el periodico deberia ser prohibido por irrespetuoso. Que responde?",
    explanation: "La libertad de prensa, garantizada por la ley del 29 de julio de 1881, permite criticar a las personalidades politicas y las instituciones. Es un pilar de la democracia, siempre que no se trate de difamacion.",
    choices: [
      { id: 'a' as const, text: "Su amigo tiene razon, no se debe criticar al presidente" },
      { id: 'b' as const, text: "El periodico puede ser procesado por ofensa al jefe de Estado" },
      { id: 'c' as const, text: "La prensa es libre de criticar a los responsables politicos, es un derecho fundamental de la democracia" },
      { id: 'd' as const, text: "El periodico puede criticar, pero unicamente con la aprobacion del gobierno" },
    ],
  },
  // S24
  {
    text: "Su vecino escribe en redes sociales que el panadero del barrio \"vende comida envenenada\" sin ninguna prueba. El panadero quiere presentar una denuncia. Tiene motivos?",
    explanation: "Afirmar publicamente hechos falsos que atentan contra el honor de una persona constituye difamacion, un delito previsto por la ley de 1881. Esto no esta protegido por la libertad de expresion.",
    choices: [
      { id: 'a' as const, text: "No, es la libertad de expresion de su vecino" },
      { id: 'b' as const, text: "Si, es difamacion porque afirma hechos falsos que atentan contra el honor del panadero" },
      { id: 'c' as const, text: "No, porque las redes sociales no estan sujetas a la ley" },
      { id: 'd' as const, text: "Si, pero unicamente si el panadero puede demostrar que su comida es buena" },
    ],
  },
  // S25
  {
    text: "Desea crear una asociacion cultural en su barrio para organizar eventos. Cuales son las condiciones en Francia?",
    explanation: "La libertad de asociacion esta garantizada por la ley del 1 de julio de 1901. Cualquier persona puede crear una asociacion presentando una declaracion en la prefectura. Bastan al menos dos personas y se deben redactar los estatutos.",
    choices: [
      { id: 'a' as const, text: "Hay que obtener una autorizacion previa del alcalde" },
      { id: 'b' as const, text: "Basta con hacer una declaracion en la prefectura, la creacion es libre" },
      { id: 'c' as const, text: "Hay que tener la nacionalidad francesa para crear una asociacion" },
      { id: 'd' as const, text: "Hay que reunir al menos diez personas y obtener la aprobacion del prefecto" },
    ],
  },
  // S26
  {
    text: "Durante un control policial en la calle, un agente le pide sus documentos de identidad. No tiene ningun documento consigo. Que sucede?",
    explanation: "En Francia, no es obligatorio llevar un documento de identidad en todo momento. Sin embargo, durante un control, si no puede justificar su identidad, puede ser retenido hasta 4 horas para verificacion.",
    choices: [
      { id: 'a' as const, text: "Es arrestado inmediatamente y puesto bajo custodia" },
      { id: 'b' as const, text: "Recibe automaticamente una multa" },
      { id: 'c' as const, text: "Puede ser retenido para una verificacion de identidad, pero no tener sus documentos no es un delito" },
      { id: 'd' as const, text: "El policia no tiene derecho a controlarlo sin motivo" },
    ],
  },
  // S27
  {
    text: "Los empleados de su empresa deciden hacer huelga para protestar contra condiciones de trabajo peligrosas. Su empleador amenaza con despedir a todos los huelguistas. Es legal?",
    explanation: "El derecho de huelga es un derecho constitucional en Francia. Un empleador no puede despedir a un empleado por haber hecho huelga, salvo en caso de falta grave cometida durante la huelga (violencia, danos).",
    choices: [
      { id: 'a' as const, text: "Si, el empleador puede despedir a los huelguistas porque no trabajan" },
      { id: 'b' as const, text: "No, el derecho de huelga es constitucional y el despido por huelga esta prohibido" },
      { id: 'c' as const, text: "Si, si la huelga dura mas de 48 horas" },
      { id: 'd' as const, text: "No, pero puede reducir definitivamente su salario" },
    ],
  },
  // S28
  {
    text: "Su vecino instala una camara de vigilancia que filma directamente la entrada de su departamento y el pasillo comun. Tiene usted algun recurso?",
    explanation: "El derecho al respeto de la vida privada esta garantizado por el articulo 9 del Codigo Civil. Filmar espacios comunes o la entrada del domicilio de otro sin su consentimiento es un atentado a la vida privada. Puede exigir el retiro de la camara y acudir a la justicia.",
    choices: [
      { id: 'a' as const, text: "No, su vecino tiene derecho a filmar las areas comunes" },
      { id: 'b' as const, text: "No, porque la camara esta en su propiedad" },
      { id: 'c' as const, text: "Si, pero unicamente si es propietario y no inquilino" },
      { id: 'd' as const, text: "Si, es un atentado a su vida privada y puede exigir el retiro de la camara" },
    ],
  },
  // S29
  {
    text: "Esta invitado a una cena entre colegas. Un colega le reprocha no beber alcohol diciendo que \"en Francia, brindamos juntos\". Que responde?",
    explanation: "La libertad de conciencia, protegida por la Constitucion, incluye el derecho a no consumir alcohol, ya sea por razones personales, religiosas o de salud. Nadie puede ser obligado a beber alcohol.",
    choices: [
      { id: 'a' as const, text: "Tiene razon, hay que adaptarse a las tradiciones francesas" },
      { id: 'b' as const, text: "Es libre de no beber alcohol, es una eleccion personal protegida por la libertad de conciencia" },
      { id: 'c' as const, text: "Debe beber un poco por cortesia para no ofender a sus colegas" },
      { id: 'd' as const, text: "Debe explicar sus razones religiosas para ser dispensado" },
    ],
  },
  // S30
  {
    text: "Durante un debate, una persona afirma publicamente que el Holocausto nunca existio, invocando su libertad de expresion. Que dice la ley francesa?",
    explanation: "La ley Gayssot de 1990 prohibe el negacionismo, es decir, la contestacion de la existencia de crimenes contra la humanidad. No esta cubierto por la libertad de expresion y constituye un delito penal.",
    choices: [
      { id: 'a' as const, text: "Esta cubierto por la libertad de expresion, aunque sea chocante" },
      { id: 'b' as const, text: "Esta prohibido unicamente en los medios de comunicacion, no en una conversacion privada" },
      { id: 'c' as const, text: "El negacionismo es un delito penal en Francia, no esta protegido por la libertad de expresion" },
      { id: 'd' as const, text: "Esta permitido si la persona lo presenta como una opinion y no como un hecho" },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  //  THEME 2 — Sistema institucional (15 preguntas)
  // ═══════════════════════════════════════════════════════════

  // S31
  {
    text: "Es el dia de las elecciones municipales y no encuentra su credencial de elector. Puede votar de todos modos?",
    explanation: "La credencial de elector no es obligatoria para votar. En los municipios de mas de 1,000 habitantes, basta una identificacion oficial. En los municipios de menos de 1,000 habitantes, no se exige ningun documento.",
    choices: [
      { id: 'a' as const, text: "No, la credencial de elector es indispensable para votar" },
      { id: 'b' as const, text: "Si, una identificacion oficial es suficiente en los municipios de mas de 1,000 habitantes" },
      { id: 'c' as const, text: "Si, pero unicamente si hace una declaracion jurada" },
      { id: 'd' as const, text: "No, debe solicitar un duplicado en el ayuntamiento antes de votar" },
    ],
  },
  // S32
  {
    text: "Debe salir de viaje de trabajo el dia de la segunda vuelta de la eleccion presidencial. No quiere perder la votacion. Que puede hacer?",
    explanation: "Puede otorgar un poder notarial a un elector inscrito en el mismo municipio. El tramite se realiza en la comisaria, en la gendarmeria, en el tribunal judicial o en linea a traves del sitio maprocuration.gouv.fr.",
    choices: [
      { id: 'a' as const, text: "Puede votar por correo enviando su boleta" },
      { id: 'b' as const, text: "No puede hacer nada, debe estar presente fisicamente" },
      { id: 'c' as const, text: "Puede otorgar un poder para que otro elector vote en su nombre" },
      { id: 'd' as const, text: "Puede votar en linea en el sitio web del gobierno" },
    ],
  },
  // S33
  {
    text: "Acaba de obtener la nacionalidad francesa y desea votar en las proximas elecciones. Cual es el primer tramite obligatorio?",
    explanation: "Para poder votar en Francia, es necesario estar inscrito en las listas electorales. La inscripcion puede hacerse en el ayuntamiento, en linea, o es automatica a los 18 anos para las personas nacidas en Francia. Los nuevos ciudadanos deben inscribirse.",
    choices: [
      { id: 'a' as const, text: "Se inscribe automaticamente al obtener la nacionalidad" },
      { id: 'b' as const, text: "Debe inscribirse en las listas electorales de su municipio" },
      { id: 'c' as const, text: "Debe esperar cinco anos despues de la naturalizacion para poder votar" },
      { id: 'd' as const, text: "Debe obtener una autorizacion especial del prefecto" },
    ],
  },
  // S34
  {
    text: "En la casilla de votacion, nota que un elector toma directamente una sola boleta sin pasar por la cabina de votacion. El escrutador le pide que pase por la cabina. Tiene razon el escrutador?",
    explanation: "El paso por la cabina de votacion es obligatorio para garantizar el secreto del voto. Aunque el elector no desee ocultar su eleccion, la cabina es una etapa obligatoria del proceso de votacion en Francia.",
    choices: [
      { id: 'a' as const, text: "No, el paso por la cabina de votacion es opcional" },
      { id: 'b' as const, text: "Si, el paso por la cabina de votacion es obligatorio para garantizar el secreto del voto" },
      { id: 'c' as const, text: "No, solo el sobre cerrado garantiza el secreto del voto" },
      { id: 'd' as const, text: "Si, pero unicamente para las elecciones presidenciales" },
    ],
  },
  // S35
  {
    text: "Su vecino es de nacionalidad portuguesa y vive en Francia desde hace 10 anos. Desea votar en las elecciones. En cuales elecciones puede participar?",
    explanation: "Los ciudadanos de la Union Europea que residen en Francia pueden votar en las elecciones municipales y en las elecciones europeas, pero no en las elecciones presidenciales, legislativas o regionales.",
    choices: [
      { id: 'a' as const, text: "En todas las elecciones, porque vive en Francia desde hace mas de 5 anos" },
      { id: 'b' as const, text: "En ninguna eleccion, porque no tiene la nacionalidad francesa" },
      { id: 'c' as const, text: "En las elecciones municipales y europeas unicamente" },
      { id: 'd' as const, text: "Unicamente en las elecciones europeas" },
    ],
  },
  // S36
  {
    text: "Desea casarse civilmente en Francia. A quien debe dirigirse para celebrar el matrimonio?",
    explanation: "En Francia, solo el matrimonio civil tiene valor juridico. Se celebra en el ayuntamiento por el alcalde o un adjunto. El matrimonio religioso no tiene ningun valor legal si no esta precedido por el matrimonio civil.",
    choices: [
      { id: 'a' as const, text: "A un notario que oficializa el matrimonio" },
      { id: 'b' as const, text: "Al alcalde o un adjunto de su municipio, en el ayuntamiento" },
      { id: 'c' as const, text: "Al tribunal judicial de su ciudad" },
      { id: 'd' as const, text: "Al prefecto del departamento" },
    ],
  },
  // S37
  {
    text: "Desea construir una extension de su casa. Su vecino le dice que debe solicitar un permiso de construccion. A quien debe dirigirse?",
    explanation: "Las solicitudes de permiso de construccion deben presentarse en el ayuntamiento del municipio donde se ubica el terreno. Es el alcalde quien otorga las autorizaciones de urbanismo en nombre del municipio.",
    choices: [
      { id: 'a' as const, text: "A la prefectura del departamento" },
      { id: 'b' as const, text: "Al ayuntamiento de su municipio" },
      { id: 'c' as const, text: "Al consejo regional" },
      { id: 'd' as const, text: "Directamente al Ministerio de Vivienda" },
    ],
  },
  // S38
  {
    text: "Su hijo tiene 3 anos y desea inscribirlo en la escuela preescolar publica. Cual es su primer tramite?",
    explanation: "La inscripcion en la escuela preescolar publica se realiza primero en el ayuntamiento de su municipio. El ayuntamiento le indica la escuela de su sector, y luego usted finaliza la inscripcion con el director de la escuela.",
    choices: [
      { id: 'a' as const, text: "Va directamente a la escuela de su eleccion para inscribir a su hijo" },
      { id: 'b' as const, text: "Primero hace la inscripcion en el ayuntamiento, que le asigna una escuela de sector" },
      { id: 'c' as const, text: "Contacta al rectorado de su academia" },
      { id: 'd' as const, text: "Espera una carta automatica del Ministerio de Educacion" },
    ],
  },
  // S39
  {
    text: "Desea asistir a una sesion del consejo municipal de su municipio para saber como se gasta el presupuesto. Tiene derecho a hacerlo?",
    explanation: "Las sesiones del consejo municipal son publicas (salvo casos excepcionales a puerta cerrada). Todo ciudadano puede asistir. Las deliberaciones tambien son consultables en el ayuntamiento. Es un principio de transparencia democratica.",
    choices: [
      { id: 'a' as const, text: "No, solo los funcionarios electos y los periodistas pueden asistir a las sesiones" },
      { id: 'b' as const, text: "Si, las sesiones del consejo municipal son publicas y abiertas a todos" },
      { id: 'c' as const, text: "Si, pero unicamente si hace una solicitud escrita al alcalde" },
      { id: 'd' as const, text: "No, el presupuesto es un documento confidencial" },
    ],
  },
  // S40
  {
    text: "Su abuelo anciano necesita la Asignacion Personalizada de Autonomia (APA) para financiar su ayuda a domicilio. A cual colectividad debe dirigirse?",
    explanation: "La accion social, en particular la APA (Asignacion Personalizada de Autonomia) y el RSA, es competencia del departamento (consejo departamental). Es una de las principales misiones de los departamentos.",
    choices: [
      { id: 'a' as const, text: "Al ayuntamiento de su municipio" },
      { id: 'b' as const, text: "Al consejo departamental, porque la accion social es competencia del departamento" },
      { id: 'c' as const, text: "A la caja de asignaciones familiares (CAF)" },
      { id: 'd' as const, text: "Al consejo regional" },
    ],
  },
  // S41
  {
    text: "El gobierno desea aumentar los impuestos. Un amigo le dice que el Primer Ministro puede hacerlo solo por decreto. Es correcto?",
    explanation: "En Francia, solo el Parlamento (Asamblea Nacional y Senado) tiene el poder de votar las leyes, incluidas las relativas a los impuestos. Es el principio de separacion de poderes: el gobierno propone, el Parlamento decide.",
    choices: [
      { id: 'a' as const, text: "Si, el Primer Ministro puede modificar los impuestos por decreto" },
      { id: 'b' as const, text: "No, solo el presidente de la Republica puede aumentar los impuestos" },
      { id: 'c' as const, text: "No, solo el Parlamento puede votar las leyes fiscales, es el principio de separacion de poderes" },
      { id: 'd' as const, text: "Si, si el Consejo Constitucional da su acuerdo" },
    ],
  },
  // S42
  {
    text: "El Parlamento vota una ley que, segun los ciudadanos, atenta contra la libertad de expresion. Pueden los ciudadanos impugnar esta ley y como?",
    explanation: "Desde 2010, todo justiciable puede plantear una Cuestion Prioritaria de Constitucionalidad (QPC) ante un tribunal. El Consejo Constitucional verifica entonces que la ley respete los derechos y libertades garantizados por la Constitucion.",
    choices: [
      { id: 'a' as const, text: "No, una ley votada por el Parlamento nunca puede ser impugnada" },
      { id: 'b' as const, text: "Si, dirigiendo una peticion al presidente de la Republica" },
      { id: 'c' as const, text: "Si, planteando una Cuestion Prioritaria de Constitucionalidad (QPC) ante un tribunal" },
      { id: 'd' as const, text: "Si, organizando un referendum ciudadano" },
    ],
  },
  // S43
  {
    text: "En la television, se entera de que el presidente de la Republica disolvio la Asamblea Nacional y convoco nuevas elecciones. Un amigo dice que es un golpe de Estado. Tiene razon?",
    explanation: "El derecho de disolucion de la Asamblea Nacional es un poder propio del presidente de la Republica, previsto por el articulo 12 de la Constitucion. Es un acto constitucional, no un golpe de Estado.",
    choices: [
      { id: 'a' as const, text: "Si, el presidente no tiene derecho a disolver la Asamblea" },
      { id: 'b' as const, text: "No, la disolucion es un poder constitucional del presidente previsto por el articulo 12" },
      { id: 'c' as const, text: "Si, salvo que el Primer Ministro haya dado su acuerdo" },
      { id: 'd' as const, text: "No, pero requiere un voto favorable del Senado" },
    ],
  },
  // S44
  {
    text: "Es extranjero en situacion regular y su permiso de residencia vence en dos meses. Donde debe hacer su solicitud de renovacion?",
    explanation: "La renovacion de los permisos de residencia se realiza en la prefectura o subprefectura del departamento de residencia. La solicitud debe presentarse antes del vencimiento del permiso vigente.",
    choices: [
      { id: 'a' as const, text: "En el ayuntamiento de su municipio" },
      { id: 'b' as const, text: "En el consulado de su pais de origen" },
      { id: 'c' as const, text: "En la prefectura o subprefectura de su departamento de residencia" },
      { id: 'd' as const, text: "En el Ministerio del Interior en Paris" },
    ],
  },
  // S45
  {
    text: "Considera que es victima de una discriminacion por parte de un servicio publico y no sabe a quien acudir. Que institucion independiente puede ayudarlo gratuitamente?",
    explanation: "El Defensor de los Derechos es una autoridad constitucional independiente encargada de luchar contra las discriminaciones, defender los derechos de los usuarios de los servicios publicos y proteger los derechos de los ninos. Su intervencion es gratuita.",
    choices: [
      { id: 'a' as const, text: "El mediador de su banco" },
      { id: 'b' as const, text: "El Defensor de los Derechos, autoridad independiente que lucha contra las discriminaciones" },
      { id: 'c' as const, text: "El diputado de su circunscripcion" },
      { id: 'd' as const, text: "El fiscal de la Republica, que es el unico competente" },
    ],
  },
];
