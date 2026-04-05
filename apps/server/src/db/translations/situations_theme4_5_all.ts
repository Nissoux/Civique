// ============================================================================
// Theme 4 – Culture, patrimoine et géographie (15 situational questions)
// ============================================================================

// ── Arabic (ar) ─────────────────────────────────────────────────────────────
export const sitTheme4Ar = [
  // S1
  {
    text: "لقد وصلت حديثاً إلى فرنسا وجارك يدعوك لمشاهدة عرض عسكري وألعاب نارية في 14 يوليو. ما المناسبة التي يُحتفل بها في هذا اليوم؟",
    explanation: "الرابع عشر من يوليو هو العيد الوطني الفرنسي. يُحيي ذكرى اقتحام سجن الباستيل عام 1789، رمز نهاية الحكم المطلق الملكي وبداية الثورة الفرنسية. تُنظم عروض عسكرية وحفلات شعبية وألعاب نارية في جميع أنحاء فرنسا.",
    choices: [
      { id: "a" as const, text: "العيد الوطني، إحياءً لذكرى اقتحام الباستيل" },
      { id: "b" as const, text: "نهاية الحرب العالمية الثانية" },
      { id: "c" as const, text: "ذكرى تأسيس دستور الجمهورية الخامسة" },
      { id: "d" as const, text: "عيد أوروبا" },
    ],
  },
  // S2
  {
    text: "في 11 نوفمبر، يُبلغك صاحب العمل أن الشركة مُغلقة. تُقام احتفالات أمام نصب الشهداء في بلديتك. بماذا يُحتفل في هذا اليوم؟",
    explanation: "الحادي عشر من نوفمبر هو يوم عطلة رسمية يُحيي ذكرى هدنة عام 1918 التي أنهت الحرب العالمية الأولى. تُقام مراسم أمام نصب الشهداء لتكريم الجنود الذين سقطوا في المعارك.",
    choices: [
      { id: "a" as const, text: "نهاية الحرب العالمية الثانية" },
      { id: "b" as const, text: "اليوم العالمي للسلام" },
      { id: "c" as const, text: "هدنة الحرب العالمية الأولى" },
      { id: "d" as const, text: "اليوم الوطني للذكرى" },
    ],
  },
  // S3
  {
    text: "تمر أمام مبنى البلدية وتلاحظ علماً أزرق وأبيض وأحمر معلقاً على الواجهة. يسألك طفلك عما يمثله. ماذا تُجيبه؟",
    explanation: "العلم ذو الألوان الثلاثة الأزرق والأبيض والأحمر هو الشعار الوطني لفرنسا، المنصوص عليه في الدستور. يمثل الأزرق والأحمر ألوان باريس، والأبيض يمثل الملكية. وهو يرمز إلى قيم الجمهورية الفرنسية.",
    choices: [
      { id: "a" as const, text: "هذا هو العلم الوطني لفرنسا، رمز الجمهورية" },
      { id: "b" as const, text: "هذا علم تزييني لعيد القرية" },
      { id: "c" as const, text: "هذا علم المنطقة" },
      { id: "d" as const, text: "هذا علم الاتحاد الأوروبي" },
    ],
  },
  // S4
  {
    text: "في الثامن من مايو، تُلاحظ أن المتاجر مغلقة وأن أكاليل الزهور موضوعة عند قاعدة نصب الشهداء. يدعوك جار للمشاركة في المراسم. بماذا يُحتفل في 8 مايو؟",
    explanation: "يُمثل الثامن من مايو 1945 نهاية الحرب العالمية الثانية في أوروبا باستسلام ألمانيا النازية. هذا اليوم عطلة رسمية لتكريم جميع من حاربوا وعانوا خلال هذا النزاع.",
    choices: [
      { id: "a" as const, text: "انتصار 1945 ونهاية الحرب العالمية الثانية في أوروبا" },
      { id: "b" as const, text: "التوقيع على معاهدة روما" },
      { id: "c" as const, text: "يوم أوروبا" },
      { id: "d" as const, text: "ذكرى تحرير باريس" },
    ],
  },
  // S5
  {
    text: "خلال حفل رسمي في البلدية، يقف الجميع عندما يُعزف نشيد. يُشرح لك أنه نشيد لا مارسييز. ما هي مكانة هذا النشيد؟",
    explanation: "لا مارسييز هو النشيد الوطني الفرنسي المنصوص عليه في الدستور (المادة 2). ألّفه روجيه دو ليل عام 1792، ويُعزف في المراسم الرسمية والمناسبات الرياضية الدولية والإحياءات التذكارية.",
    choices: [
      { id: "a" as const, text: "هو نشيد إقليمي شعبي" },
      { id: "b" as const, text: "هو نشيد عسكري مخصص للجيش" },
      { id: "c" as const, text: "هو نشيد الاتحاد الأوروبي" },
      { id: "d" as const, text: "هو النشيد الوطني لفرنسا، المنصوص عليه في الدستور" },
    ],
  },
  // S6
  {
    text: "ترغب في زيارة متحف وطني في باريس لكن ميزانيتك محدودة. يخبرك صديق أن الدخول مجاني في بعض الأيام. ما هي المعلومة الصحيحة؟",
    explanation: "المتاحف الوطنية في فرنسا، مثل اللوفر ومتحف أورسيه، مجانية في أول يوم أحد من كل شهر. كما أن الدخول مجاني عموماً لمن هم دون 26 عاماً والمقيمين في الاتحاد الأوروبي.",
    choices: [
      { id: "a" as const, text: "المتاحف الوطنية مجانية في أول يوم أحد من كل شهر" },
      { id: "b" as const, text: "المتاحف مدفوعة دائماً دون استثناء" },
      { id: "c" as const, text: "فقط المواطنون الفرنسيون يمكنهم الدخول مجاناً" },
      { id: "d" as const, text: "المتاحف مجانية فقط في 14 يوليو" },
    ],
  },
  // S7
  {
    text: "تزور جبل سان ميشيل مع أصدقاء وترى لافتة تشير إلى أنه موقع مصنف ضمن التراث العالمي لليونسكو. ماذا يعني هذا التصنيف؟",
    explanation: "التصنيف ضمن التراث العالمي لليونسكو يعترف بالقيمة العالمية الاستثنائية لموقع ثقافي أو طبيعي. تضم فرنسا أكثر من 50 موقعاً مصنفاً. يستلزم هذا التصنيف حماية وصوناً معززين للموقع.",
    choices: [
      { id: "a" as const, text: "الموقع معترف به لقيمته العالمية الاستثنائية ويحظى بحماية خاصة" },
      { id: "b" as const, text: "الموقع ملك لمنظمة الأمم المتحدة" },
      { id: "c" as const, text: "الموقع مخصص للسياح الأجانب" },
      { id: "d" as const, text: "الموقع محظور على الجمهور للحفاظ عليه" },
    ],
  },
  // S8
  {
    text: "أنت مدعو لتناول العشاء عند جيران فرنسيين يقدمون لك وجبة تقليدية تتكون من مقبلات وطبق رئيسي وجبن وحلوى. ما هي المعلومة الصحيحة عن فن الطبخ الفرنسي؟",
    explanation: "تم تسجيل الوجبة الفرنسية التقليدية ضمن التراث الثقافي غير المادي لليونسكو منذ عام 2010. تقليد الوجبة المنظمة (مقبلات، طبق رئيسي، جبن، حلوى) هو عنصر مهم في الثقافة والروابط الاجتماعية في فرنسا.",
    choices: [
      { id: "a" as const, text: "فن الطبخ الفرنسي ليس له أي اعتراف دولي" },
      { id: "b" as const, text: "المطبخ الفرنسي هو تقليد باريسي فقط" },
      { id: "c" as const, text: "الوجبة الفرنسية التقليدية تتكون من طبق واحد فقط" },
      { id: "d" as const, text: "الوجبة الفرنسية التقليدية مسجلة ضمن التراث غير المادي لليونسكو" },
    ],
  },
  // S9
  {
    text: "في سبتمبر، ترى ملصقات تعلن عن أيام التراث الأوروبية. تفتح مبانٍ عادةً مغلقة أمام الجمهور أبوابها. ما هو هذا الحدث؟",
    explanation: "تُقام أيام التراث الأوروبية كل عام في سبتمبر. تتيح زيارة أماكن عادةً مغلقة أمام الجمهور مجاناً: وزارات وقصور ومبانٍ تاريخية. إنه حدث ثقافي كبير في فرنسا وأوروبا.",
    choices: [
      { id: "a" as const, text: "حدث تجاري لبيع منتجات إقليمية" },
      { id: "b" as const, text: "عيد ديني أوروبي" },
      { id: "c" as const, text: "حدث سنوي يتيح زيارة أماكن تراثية عادةً مغلقة مجاناً" },
      { id: "d" as const, text: "يوم لأعمال ترميم المباني العامة" },
    ],
  },
  // S10
  {
    text: "يعود طفلك من المدرسة ويحدثك عن رحلة مدرسية إلى المتحف ودرس في التربية الموسيقية. لماذا تتضمن المدرسة الفرنسية هذه الأنشطة الثقافية؟",
    explanation: "التربية الفنية والثقافية هي مهمة أساسية للمدرسة في فرنسا. تهدف إلى تمكين جميع التلاميذ، بغض النظر عن وسطهم الاجتماعي، من الوصول إلى الثقافة وتنمية حسهم الفني. إنها ركيزة من ركائز المساواة الجمهورية.",
    choices: [
      { id: "a" as const, text: "التربية الفنية والثقافية مهمة مدرسية لضمان وصول الجميع إلى الثقافة" },
      { id: "b" as const, text: "هذا فقط لتسلية الأطفال" },
      { id: "c" as const, text: "هذا نشاط مدفوع مخصص للعائلات الميسورة" },
      { id: "d" as const, text: "هذه الأنشطة اختيارية وتعتمد على رغبة المعلم" },
    ],
  },
  // S11
  {
    text: "تبحث عن عمل وتتصفح عروض العمل في مناطق فرنسا المختلفة. كم منطقة في فرنسا الأم منذ إصلاح 2015؟",
    explanation: "منذ الإصلاح الإقليمي لعام 2015، تضم فرنسا الأم 13 منطقة (بدلاً من 22 سابقاً). تُدار المناطق بواسطة مجلس إقليمي منتخب. وتتولى إدارة النقل الإقليمي والثانويات والتنمية الاقتصادية.",
    choices: [
      { id: "a" as const, text: "22 منطقة" },
      { id: "b" as const, text: "13 منطقة" },
      { id: "c" as const, text: "18 منطقة" },
      { id: "d" as const, text: "26 منطقة" },
    ],
  },
  // S12
  {
    text: "يخبرك زميل من غوادلوب أنه فرنسي. تتفاجأ لأن غوادلوب بعيدة عن فرنسا الأم. ما هو الوضع القانوني لأقاليم ما وراء البحار؟",
    explanation: "الأقاليم والمناطق فيما وراء البحار مثل غوادلوب ومارتينيك وغيانا وريونيون ومايوت هي جزء لا يتجزأ من الجمهورية الفرنسية. سكانها مواطنون فرنسيون كاملو الحقوق ولهم نفس الحقوق والواجبات.",
    choices: [
      { id: "a" as const, text: "هي دول مستقلة متحالفة مع فرنسا" },
      { id: "b" as const, text: "سكانها ليسوا مواطنين فرنسيين" },
      { id: "c" as const, text: "هي أقاليم تابعة للجمهورية الفرنسية وسكانها مواطنون فرنسيون" },
      { id: "d" as const, text: "هي مستعمرات بدون حقوق سياسية" },
    ],
  },
  // S13
  {
    text: "ترغب في السفر إلى إسبانيا لقضاء العطلة. يخبرك صديق أنك لا تحتاج إلى جواز سفر إذا كان لديك تصريح إقامة فرنسي. لماذا هذا ممكن؟",
    explanation: "فرنسا عضو في الاتحاد الأوروبي وفي فضاء شنغن الذي يسمح بحرية تنقل الأشخاص بين الدول الأعضاء دون رقابة على الحدود الداخلية. تصريح الإقامة الفرنسي الساري يتيح السفر في فضاء شنغن.",
    choices: [
      { id: "a" as const, text: "لدى إسبانيا وفرنسا اتفاقية ثنائية خاصة" },
      { id: "b" as const, text: "بفضل فضاء شنغن الذي يسمح بحرية التنقل بين الدول الأعضاء" },
      { id: "c" as const, text: "لا توجد رقابة على الحدود في أوروبا أبداً" },
      { id: "d" as const, text: "هذا غير صحيح، جواز السفر مطلوب دائماً" },
    ],
  },
  // S14
  {
    text: "وصلت حديثاً إلى فرنسا وتحتاج إلى تحويل أموالك. ما هي العملة المستخدمة في فرنسا ومنذ متى؟",
    explanation: "تستخدم فرنسا اليورو (€) كعملة منذ الأول من يناير 2002 (تداول القطع والأوراق النقدية). اليورو هو العملة المشتركة لمنطقة اليورو التي تضم 20 دولة في الاتحاد الأوروبي. وقد حل محل الفرنك الفرنسي.",
    choices: [
      { id: "a" as const, text: "الفرنك الفرنسي منذ الأزل" },
      { id: "b" as const, text: "الدولار الأوروبي منذ 2010" },
      { id: "c" as const, text: "اليورو، المتداول منذ 2002" },
      { id: "d" as const, text: "الجنيه الإسترليني منذ البريكست" },
    ],
  },
  // S15
  {
    text: "تتلقى رسالة رسمية تذكر بلديتك ومحافظتك. لا تفهم الفرق بين هذين المستويين الإداريين. ما هو التفسير الصحيح؟",
    explanation: "فرنسا منظمة في ثلاثة مستويات من الجماعات المحلية: البلدية (يديرها رئيس البلدية)، والمحافظة (يديرها المجلس المحلي)، والمنطقة (يديرها المجلس الإقليمي). البلدية هي أقرب مستوى إلى المواطنين.",
    choices: [
      { id: "a" as const, text: "البلدية والمحافظة هما نفس الشيء" },
      { id: "b" as const, text: "المحافظة هي تجمع لعدة بلديات وهي مستوى إداري أعلى" },
      { id: "c" as const, text: "المحافظة لم تعد موجودة منذ إصلاح 2015" },
      { id: "d" as const, text: "البلدية أكبر من المحافظة" },
    ],
  },
];

// ── Spanish (es) ────────────────────────────────────────────────────────────
export const sitTheme4Es = [
  // S1
  {
    text: "Acaba de llegar a Francia y su vecino lo invita a ver un desfile militar y fuegos artificiales el 14 de julio. ¿Qué se celebra ese día?",
    explanation: "El 14 de julio es la fiesta nacional francesa. Conmemora la toma de la Bastilla en 1789, símbolo del fin del absolutismo real y del inicio de la Revolución Francesa. Se organizan desfiles militares, bailes populares y fuegos artificiales en toda Francia.",
    choices: [
      { id: "a" as const, text: "La fiesta nacional, que conmemora la toma de la Bastilla" },
      { id: "b" as const, text: "El fin de la Segunda Guerra Mundial" },
      { id: "c" as const, text: "El aniversario de la Constitución de la Quinta República" },
      { id: "d" as const, text: "La fiesta de Europa" },
    ],
  },
  // S2
  {
    text: "El 11 de noviembre, su empleador le informa que la empresa está cerrada. Se realizan ceremonias frente al monumento a los caídos de su municipio. ¿Qué se conmemora ese día?",
    explanation: "El 11 de noviembre es un día feriado que conmemora el armisticio de 1918, que marcó el fin de la Primera Guerra Mundial. Se organizan ceremonias frente a los monumentos a los caídos para rendir homenaje a los soldados caídos en combate.",
    choices: [
      { id: "a" as const, text: "El fin de la Segunda Guerra Mundial" },
      { id: "b" as const, text: "El Día Internacional de la Paz" },
      { id: "c" as const, text: "El armisticio de la Primera Guerra Mundial" },
      { id: "d" as const, text: "El Día Nacional del Recuerdo" },
    ],
  },
  // S3
  {
    text: "Pasa frente al ayuntamiento de su municipio y nota una bandera azul, blanca y roja colgada en la fachada. Su hijo le pregunta qué representa. ¿Qué le responde?",
    explanation: "La bandera tricolor azul, blanca y roja es el emblema nacional de Francia, inscrito en la Constitución. El azul y el rojo representan los colores de París, y el blanco la monarquía. Simboliza los valores de la República Francesa.",
    choices: [
      { id: "a" as const, text: "Es la bandera nacional de Francia, símbolo de la República" },
      { id: "b" as const, text: "Es una bandera decorativa para la fiesta del pueblo" },
      { id: "c" as const, text: "Es la bandera de la región" },
      { id: "d" as const, text: "Es la bandera de la Unión Europea" },
    ],
  },
  // S4
  {
    text: "El 8 de mayo, observa que los comercios están cerrados y que se depositan ofrendas florales al pie del monumento a los caídos. Un vecino lo invita a la ceremonia. ¿Qué se conmemora el 8 de mayo?",
    explanation: "El 8 de mayo de 1945 marca el fin de la Segunda Guerra Mundial en Europa, con la capitulación de la Alemania nazi. Este día feriado es una ocasión para rendir homenaje a todos los que combatieron y sufrieron durante ese conflicto.",
    choices: [
      { id: "a" as const, text: "La victoria de 1945 y el fin de la Segunda Guerra Mundial en Europa" },
      { id: "b" as const, text: "La firma del Tratado de Roma" },
      { id: "c" as const, text: "El Día de Europa" },
      { id: "d" as const, text: "El aniversario de la Liberación de París" },
    ],
  },
  // S5
  {
    text: "Durante una ceremonia oficial en el ayuntamiento, todos se ponen de pie cuando suena un himno. Le explican que es La Marsellesa. ¿Cuál es el estatus de ese canto?",
    explanation: "La Marsellesa es el himno nacional de Francia, inscrito en la Constitución (artículo 2). Compuesto por Rouget de Lisle en 1792, se interpreta en ceremonias oficiales, eventos deportivos internacionales y conmemoraciones.",
    choices: [
      { id: "a" as const, text: "Es un canto regional popular" },
      { id: "b" as const, text: "Es un canto militar reservado al ejército" },
      { id: "c" as const, text: "Es el himno de la Unión Europea" },
      { id: "d" as const, text: "Es el himno nacional de Francia, inscrito en la Constitución" },
    ],
  },
  // S6
  {
    text: "Desea visitar un museo nacional en París pero tiene un presupuesto limitado. Un amigo le dice que ciertos días la entrada es gratuita. ¿Qué información es correcta?",
    explanation: "Los museos nacionales de Francia, como el Louvre o el Museo de Orsay, son gratuitos el primer domingo de cada mes. Además, la entrada es generalmente gratuita para menores de 26 años residentes en la Unión Europea.",
    choices: [
      { id: "a" as const, text: "Los museos nacionales son gratuitos el primer domingo del mes" },
      { id: "b" as const, text: "Los museos siempre son de pago, sin excepción" },
      { id: "c" as const, text: "Solo los ciudadanos franceses pueden entrar gratis" },
      { id: "d" as const, text: "Los museos son gratuitos únicamente el 14 de julio" },
    ],
  },
  // S7
  {
    text: "Visita el Monte Saint-Michel con amigos y ve un cartel que indica que es un sitio clasificado como Patrimonio Mundial de la UNESCO. ¿Qué significa esa distinción?",
    explanation: "La clasificación como Patrimonio Mundial de la UNESCO reconoce el valor universal excepcional de un sitio cultural o natural. Francia cuenta con más de 50 sitios clasificados. Esta distinción implica una protección y preservación reforzadas del sitio.",
    choices: [
      { id: "a" as const, text: "El sitio es reconocido por su valor universal excepcional y tiene protección especial" },
      { id: "b" as const, text: "El sitio pertenece a la Organización de las Naciones Unidas" },
      { id: "c" as const, text: "El sitio está reservado a los turistas extranjeros" },
      { id: "d" as const, text: "El sitio está prohibido al público para preservarlo" },
    ],
  },
  // S8
  {
    text: "Está invitado a cenar con vecinos franceses que le ofrecen una comida típica con entrada, plato principal, queso y postre. ¿Qué afirmación es verdadera sobre la gastronomía francesa?",
    explanation: "La comida gastronómica de los franceses está inscrita en el patrimonio cultural inmaterial de la UNESCO desde 2010. La tradición de la comida estructurada (aperitivo, entrada, plato, queso, postre) es un elemento importante de la cultura y el vínculo social en Francia.",
    choices: [
      { id: "a" as const, text: "La gastronomía francesa no tiene ningún reconocimiento internacional" },
      { id: "b" as const, text: "La cocina francesa es únicamente una tradición parisina" },
      { id: "c" as const, text: "La comida francesa tradicional consta de un solo plato" },
      { id: "d" as const, text: "La comida gastronómica francesa está inscrita en el patrimonio inmaterial de la UNESCO" },
    ],
  },
  // S9
  {
    text: "En septiembre, ve afiches que anuncian las Jornadas Europeas del Patrimonio. Edificios habitualmente cerrados al público abren sus puertas. ¿De qué se trata?",
    explanation: "Las Jornadas Europeas del Patrimonio se celebran cada año en septiembre. Permiten visitar gratuitamente lugares habitualmente cerrados al público: ministerios, palacios, edificios históricos. Es un evento cultural importante en Francia y Europa.",
    choices: [
      { id: "a" as const, text: "Un evento comercial para vender productos regionales" },
      { id: "b" as const, text: "Una fiesta religiosa europea" },
      { id: "c" as const, text: "Un evento anual que permite visitar gratuitamente lugares patrimoniales habitualmente cerrados" },
      { id: "d" as const, text: "Un día de obras de renovación de edificios públicos" },
    ],
  },
  // S10
  {
    text: "Su hijo regresa de la escuela y le cuenta sobre una salida escolar al museo y una clase de educación musical. ¿Por qué la escuela francesa incluye estas actividades culturales?",
    explanation: "La educación artística y cultural es una misión fundamental de la escuela en Francia. Busca permitir a todos los alumnos, independientemente de su origen social, acceder a la cultura y desarrollar su sensibilidad artística. Es un pilar de la igualdad republicana.",
    choices: [
      { id: "a" as const, text: "La educación artística y cultural es una misión de la escuela para garantizar el acceso de todos a la cultura" },
      { id: "b" as const, text: "Es únicamente para entretener a los niños" },
      { id: "c" as const, text: "Es una actividad de pago reservada a familias acomodadas" },
      { id: "d" as const, text: "Estas actividades son opcionales y dependen de la voluntad del maestro" },
    ],
  },
  // S11
  {
    text: "Busca empleo y consulta ofertas en distintas regiones de Francia. ¿Cuántas regiones metropolitanas tiene Francia desde la reforma de 2015?",
    explanation: "Desde la reforma territorial de 2015, la Francia metropolitana cuenta con 13 regiones (en lugar de 22 anteriormente). Las regiones son dirigidas por un consejo regional electo. Gestionan el transporte regional, los liceos y el desarrollo económico.",
    choices: [
      { id: "a" as const, text: "22 regiones" },
      { id: "b" as const, text: "13 regiones" },
      { id: "c" as const, text: "18 regiones" },
      { id: "d" as const, text: "26 regiones" },
    ],
  },
  // S12
  {
    text: "Un colega originario de Guadalupe le explica que es francés. Le sorprende porque Guadalupe está lejos de la metrópoli. ¿Cuál es la situación jurídica de los territorios de ultramar?",
    explanation: "Los departamentos y regiones de ultramar como Guadalupe, Martinica, Guayana, Reunión y Mayotte forman parte integral de la República Francesa. Sus habitantes son ciudadanos franceses de pleno derecho, con los mismos derechos y deberes.",
    choices: [
      { id: "a" as const, text: "Son países independientes aliados de Francia" },
      { id: "b" as const, text: "Sus habitantes no son ciudadanos franceses" },
      { id: "c" as const, text: "Son territorios de la República Francesa cuyos habitantes son ciudadanos franceses" },
      { id: "d" as const, text: "Son colonias sin derechos políticos" },
    ],
  },
  // S13
  {
    text: "Desea viajar a España de vacaciones. Un amigo le dice que no necesita pasaporte si tiene un permiso de residencia francés. ¿Por qué es posible?",
    explanation: "Francia es miembro de la Unión Europea y del espacio Schengen, que permite la libre circulación de personas entre los países miembros sin control en las fronteras interiores. Un permiso de residencia francés válido permite viajar en el espacio Schengen.",
    choices: [
      { id: "a" as const, text: "España y Francia tienen un acuerdo bilateral especial" },
      { id: "b" as const, text: "Gracias al espacio Schengen que permite la libre circulación entre países miembros" },
      { id: "c" as const, text: "Nunca hay control fronterizo en Europa" },
      { id: "d" as const, text: "Eso no es cierto, el pasaporte siempre es obligatorio" },
    ],
  },
  // S14
  {
    text: "Acaba de llegar a Francia y necesita cambiar su dinero. ¿Cuál es la moneda utilizada en Francia y desde cuándo?",
    explanation: "Francia utiliza el euro (€) como moneda desde el 1 de enero de 2002 (puesta en circulación de monedas y billetes). El euro es la moneda común de la zona euro, que agrupa a 20 países de la Unión Europea. Reemplazó al franco francés.",
    choices: [
      { id: "a" as const, text: "El franco francés, desde siempre" },
      { id: "b" as const, text: "El dólar europeo, desde 2010" },
      { id: "c" as const, text: "El euro, en circulación desde 2002" },
      { id: "d" as const, text: "La libra, desde el Brexit" },
    ],
  },
  // S15
  {
    text: "Recibe un correo oficial que menciona su municipio y su departamento. No entiende la diferencia entre estos dos niveles administrativos. ¿Qué explicación es correcta?",
    explanation: "Francia se organiza en tres niveles de colectividades territoriales: el municipio (gestionado por el alcalde), el departamento (gestionado por el consejo departamental) y la región (gestionada por el consejo regional). El municipio es el nivel más cercano a los ciudadanos.",
    choices: [
      { id: "a" as const, text: "El municipio y el departamento son lo mismo" },
      { id: "b" as const, text: "El departamento es una agrupación de varios municipios, es un nivel administrativo superior" },
      { id: "c" as const, text: "El departamento ya no existe desde la reforma de 2015" },
      { id: "d" as const, text: "El municipio es más grande que el departamento" },
    ],
  },
];

// ── Farsi (fa) ──────────────────────────────────────────────────────────────
export const sitTheme4Fa = [
  // S1
  {
    text: "شما تازه به فرانسه آمده‌اید و همسایه‌تان شما را برای تماشای رژه نظامی و آتش‌بازی در ۱۴ ژوئیه دعوت می‌کند. در این روز چه چیزی جشن گرفته می‌شود؟",
    explanation: "۱۴ ژوئیه روز ملی فرانسه است. این روز یادآور تسخیر زندان باستیل در سال ۱۷۸۹ است که نماد پایان سلطنت مطلقه و آغاز انقلاب فرانسه بود. رژه‌های نظامی، جشن‌های مردمی و آتش‌بازی در سراسر فرانسه برگزار می‌شود.",
    choices: [
      { id: "a" as const, text: "روز ملی، به یادبود تسخیر باستیل" },
      { id: "b" as const, text: "پایان جنگ جهانی دوم" },
      { id: "c" as const, text: "سالگرد قانون اساسی جمهوری پنجم" },
      { id: "d" as const, text: "جشن اروپا" },
    ],
  },
  // S2
  {
    text: "در ۱۱ نوامبر، کارفرمای شما اطلاع می‌دهد که شرکت تعطیل است. مراسمی جلوی بنای یادبود شهدا در شهرداری شما برگزار می‌شود. این روز یادآور چه رویدادی است؟",
    explanation: "۱۱ نوامبر یک روز تعطیل رسمی است که یادآور آتش‌بس ۱۹۱۸ و پایان جنگ جهانی اول است. مراسمی در کنار بناهای یادبود شهدا برای ادای احترام به سربازانی که در نبرد جان باختند برگزار می‌شود.",
    choices: [
      { id: "a" as const, text: "پایان جنگ جهانی دوم" },
      { id: "b" as const, text: "روز جهانی صلح" },
      { id: "c" as const, text: "آتش‌بس جنگ جهانی اول" },
      { id: "d" as const, text: "روز ملی یادبود" },
    ],
  },
  // S3
  {
    text: "از جلوی شهرداری رد می‌شوید و پرچمی آبی، سفید و قرمز بر نمای ساختمان می‌بینید. فرزندتان از شما می‌پرسد این نشانه چیست. چه پاسخی می‌دهید؟",
    explanation: "پرچم سه‌رنگ آبی، سفید و قرمز نشان ملی فرانسه و در قانون اساسی ذکر شده است. آبی و قرمز نماد رنگ‌های پاریس و سفید نماد سلطنت است. این پرچم نماد ارزش‌های جمهوری فرانسه است.",
    choices: [
      { id: "a" as const, text: "این پرچم ملی فرانسه و نماد جمهوری است" },
      { id: "b" as const, text: "این یک پرچم تزئینی برای جشن محلی است" },
      { id: "c" as const, text: "این پرچم منطقه‌ای است" },
      { id: "d" as const, text: "این پرچم اتحادیه اروپا است" },
    ],
  },
  // S4
  {
    text: "در ۸ مه، مشاهده می‌کنید که فروشگاه‌ها بسته‌اند و دسته‌گل‌هایی در پای بنای یادبود شهدا گذاشته شده. همسایه‌ای شما را به مراسم دعوت می‌کند. ۸ مه یادآور چه رویدادی است؟",
    explanation: "۸ مه ۱۹۴۵ نشانگر پایان جنگ جهانی دوم در اروپا با تسلیم آلمان نازی است. این روز تعطیل فرصتی برای ادای احترام به همه کسانی است که در این جنگ جنگیدند و رنج کشیدند.",
    choices: [
      { id: "a" as const, text: "پیروزی ۱۹۴۵ و پایان جنگ جهانی دوم در اروپا" },
      { id: "b" as const, text: "امضای پیمان رم" },
      { id: "c" as const, text: "روز اروپا" },
      { id: "d" as const, text: "سالگرد آزادسازی پاریس" },
    ],
  },
  // S5
  {
    text: "در یک مراسم رسمی در شهرداری، همه هنگام پخش سرودی بر می‌خیزند. به شما گفته می‌شود این سرود لا مارسه‌یز است. جایگاه این سرود چیست؟",
    explanation: "لا مارسه‌یز سرود ملی فرانسه است که در قانون اساسی (ماده ۲) ذکر شده. این سرود توسط روژه دو لیل در سال ۱۷۹۲ ساخته شده و در مراسم رسمی، رویدادهای ورزشی بین‌المللی و یادبودها اجرا می‌شود.",
    choices: [
      { id: "a" as const, text: "یک سرود محلی مردمی است" },
      { id: "b" as const, text: "یک سرود نظامی مخصوص ارتش است" },
      { id: "c" as const, text: "سرود اتحادیه اروپا است" },
      { id: "d" as const, text: "سرود ملی فرانسه است که در قانون اساسی ذکر شده" },
    ],
  },
  // S6
  {
    text: "می‌خواهید از یک موزه ملی در پاریس بازدید کنید اما بودجه محدودی دارید. دوستتان می‌گوید بعضی روزها ورود رایگان است. کدام اطلاعات صحیح است؟",
    explanation: "موزه‌های ملی فرانسه مانند لوور و موزه اورسه در اولین یکشنبه هر ماه رایگان هستند. همچنین ورود برای افراد زیر ۲۶ سال مقیم اتحادیه اروپا معمولاً رایگان است.",
    choices: [
      { id: "a" as const, text: "موزه‌های ملی در اولین یکشنبه هر ماه رایگان هستند" },
      { id: "b" as const, text: "موزه‌ها همیشه پولی هستند بدون استثنا" },
      { id: "c" as const, text: "فقط شهروندان فرانسوی می‌توانند رایگان وارد شوند" },
      { id: "d" as const, text: "موزه‌ها فقط در ۱۴ ژوئیه رایگان هستند" },
    ],
  },
  // S7
  {
    text: "با دوستان از مون‌سن‌میشل بازدید می‌کنید و تابلویی می‌بینید که نشان می‌دهد این مکان جزو میراث جهانی یونسکو است. این عنوان به چه معناست؟",
    explanation: "ثبت در فهرست میراث جهانی یونسکو به معنای شناسایی ارزش جهانی استثنایی یک اثر فرهنگی یا طبیعی است. فرانسه بیش از ۵۰ اثر ثبت‌شده دارد. این عنوان مستلزم حفاظت و نگهداری ویژه از اثر است.",
    choices: [
      { id: "a" as const, text: "این مکان به دلیل ارزش جهانی استثنایی شناسایی شده و حفاظت ویژه‌ای دارد" },
      { id: "b" as const, text: "این مکان متعلق به سازمان ملل متحد است" },
      { id: "c" as const, text: "این مکان مخصوص گردشگران خارجی است" },
      { id: "d" as const, text: "ورود عموم به این مکان برای حفاظت ممنوع است" },
    ],
  },
  // S8
  {
    text: "به شام نزد همسایگان فرانسوی دعوت شده‌اید که یک وعده غذای سنتی با پیش‌غذا، غذای اصلی، پنیر و دسر تدارک دیده‌اند. کدام گزاره درباره آشپزی فرانسوی صحیح است؟",
    explanation: "وعده غذای سنتی فرانسوی از سال ۲۰۱۰ در فهرست میراث فرهنگی ناملموس یونسکو ثبت شده است. سنت غذای منظم (پیش‌غذا، غذای اصلی، پنیر، دسر) عنصر مهمی در فرهنگ و پیوند اجتماعی فرانسه است.",
    choices: [
      { id: "a" as const, text: "آشپزی فرانسوی هیچ شناسایی بین‌المللی ندارد" },
      { id: "b" as const, text: "آشپزی فرانسوی فقط یک سنت پاریسی است" },
      { id: "c" as const, text: "وعده غذای سنتی فرانسوی فقط شامل یک غذا است" },
      { id: "d" as const, text: "وعده غذای سنتی فرانسوی در میراث ناملموس یونسکو ثبت شده است" },
    ],
  },
  // S9
  {
    text: "در سپتامبر، پوسترهایی می‌بینید که روزهای میراث اروپایی را اعلام می‌کنند. ساختمان‌هایی که معمولاً بسته‌اند درهایشان را باز می‌کنند. این رویداد چیست؟",
    explanation: "روزهای میراث اروپایی هر سال در سپتامبر برگزار می‌شود. امکان بازدید رایگان از مکان‌هایی که معمولاً بسته‌اند فراهم می‌شود: وزارتخانه‌ها، کاخ‌ها و ساختمان‌های تاریخی. این یک رویداد فرهنگی مهم در فرانسه و اروپا است.",
    choices: [
      { id: "a" as const, text: "رویدادی تجاری برای فروش محصولات منطقه‌ای" },
      { id: "b" as const, text: "یک جشن مذهبی اروپایی" },
      { id: "c" as const, text: "رویدادی سالانه که امکان بازدید رایگان از مکان‌های میراثی معمولاً بسته را فراهم می‌کند" },
      { id: "d" as const, text: "روزی برای بازسازی ساختمان‌های عمومی" },
    ],
  },
  // S10
  {
    text: "فرزندتان از مدرسه برمی‌گردد و از گردش مدرسه‌ای به موزه و کلاس موسیقی می‌گوید. چرا مدرسه فرانسوی این فعالیت‌های فرهنگی را در برنامه دارد؟",
    explanation: "آموزش هنری و فرهنگی یک مأموریت اساسی مدرسه در فرانسه است. هدف آن فراهم کردن دسترسی همه دانش‌آموزان به فرهنگ، صرف‌نظر از پیشینه اجتماعی آنها، و پرورش حس هنری‌شان است. این یکی از ارکان برابری جمهوری است.",
    choices: [
      { id: "a" as const, text: "آموزش هنری و فرهنگی مأموریت مدرسه برای تضمین دسترسی همه به فرهنگ است" },
      { id: "b" as const, text: "این فقط برای سرگرمی بچه‌هاست" },
      { id: "c" as const, text: "این یک فعالیت پولی مخصوص خانواده‌های مرفه است" },
      { id: "d" as const, text: "این فعالیت‌ها اختیاری هستند و به نظر معلم بستگی دارند" },
    ],
  },
  // S11
  {
    text: "به دنبال کار هستید و آگهی‌های شغلی در مناطق مختلف فرانسه را بررسی می‌کنید. فرانسه متروپل از زمان اصلاحات ۲۰۱۵ چند منطقه دارد؟",
    explanation: "از زمان اصلاح سرزمینی ۲۰۱۵، فرانسه متروپل ۱۳ منطقه دارد (به جای ۲۲ منطقه قبلی). مناطق توسط شورای منطقه‌ای منتخب اداره می‌شوند و مسئول حمل‌ونقل منطقه‌ای، دبیرستان‌ها و توسعه اقتصادی هستند.",
    choices: [
      { id: "a" as const, text: "۲۲ منطقه" },
      { id: "b" as const, text: "۱۳ منطقه" },
      { id: "c" as const, text: "۱۸ منطقه" },
      { id: "d" as const, text: "۲۶ منطقه" },
    ],
  },
  // S12
  {
    text: "همکاری از گوادلوپ به شما می‌گوید که فرانسوی است. شما تعجب می‌کنید چون گوادلوپ دور از سرزمین اصلی فرانسه است. وضعیت حقوقی سرزمین‌های فرادریایی چیست؟",
    explanation: "استان‌ها و مناطق فرادریایی مانند گوادلوپ، مارتینیک، گیانا، رئونیون و مایوت بخش جدایی‌ناپذیر جمهوری فرانسه هستند. ساکنان آنها شهروندان فرانسوی تمام‌عیار با حقوق و تکالیف یکسان هستند.",
    choices: [
      { id: "a" as const, text: "کشورهای مستقل متحد فرانسه هستند" },
      { id: "b" as const, text: "ساکنان آنها شهروند فرانسه نیستند" },
      { id: "c" as const, text: "سرزمین‌های جمهوری فرانسه هستند و ساکنان آنها شهروند فرانسه‌اند" },
      { id: "d" as const, text: "مستعمراتی بدون حقوق سیاسی هستند" },
    ],
  },
  // S13
  {
    text: "می‌خواهید برای تعطیلات به اسپانیا سفر کنید. دوستتان می‌گوید اگر اجازه اقامت فرانسه دارید نیازی به گذرنامه نیست. چرا این امکان‌پذیر است؟",
    explanation: "فرانسه عضو اتحادیه اروپا و منطقه شنگن است که امکان تردد آزاد افراد بین کشورهای عضو بدون کنترل مرزی داخلی را فراهم می‌کند. اجازه اقامت معتبر فرانسه امکان سفر در منطقه شنگن را می‌دهد.",
    choices: [
      { id: "a" as const, text: "اسپانیا و فرانسه یک توافقنامه دوجانبه ویژه دارند" },
      { id: "b" as const, text: "به لطف منطقه شنگن که تردد آزاد بین کشورهای عضو را امکان‌پذیر می‌کند" },
      { id: "c" as const, text: "در اروپا هرگز کنترل مرزی وجود ندارد" },
      { id: "d" as const, text: "این درست نیست، گذرنامه همیشه الزامی است" },
    ],
  },
  // S14
  {
    text: "تازه به فرانسه آمده‌اید و باید پولتان را تبدیل کنید. واحد پول فرانسه چیست و از چه زمانی استفاده می‌شود؟",
    explanation: "فرانسه از یورو (€) به عنوان واحد پول از اول ژانویه ۲۰۰۲ (ورود سکه‌ها و اسکناس‌ها به چرخه) استفاده می‌کند. یورو واحد پول مشترک منطقه یورو است که ۲۰ کشور اتحادیه اروپا را شامل می‌شود و جایگزین فرانک فرانسه شد.",
    choices: [
      { id: "a" as const, text: "فرانک فرانسه از همیشه" },
      { id: "b" as const, text: "دلار اروپایی از ۲۰۱۰" },
      { id: "c" as const, text: "یورو، در گردش از ۲۰۰۲" },
      { id: "d" as const, text: "پوند از زمان برگزیت" },
    ],
  },
  // S15
  {
    text: "نامه‌ای رسمی دریافت می‌کنید که شهرداری و استان شما را ذکر می‌کند. تفاوت بین این دو سطح اداری را نمی‌فهمید. کدام توضیح صحیح است؟",
    explanation: "فرانسه در سه سطح واحدهای محلی سازمان‌دهی شده: شهرداری (به مدیریت شهردار)، استان (به مدیریت شورای استانی) و منطقه (به مدیریت شورای منطقه‌ای). شهرداری نزدیک‌ترین سطح به شهروندان است.",
    choices: [
      { id: "a" as const, text: "شهرداری و استان یکی هستند" },
      { id: "b" as const, text: "استان مجموعه‌ای از چندین شهرداری و یک سطح اداری بالاتر است" },
      { id: "c" as const, text: "استان از اصلاحات ۲۰۱۵ دیگر وجود ندارد" },
      { id: "d" as const, text: "شهرداری بزرگ‌تر از استان است" },
    ],
  },
];

// ── Hindi (hi) ──────────────────────────────────────────────────────────────
export const sitTheme4Hi = [
  // S1
  {
    text: "आप हाल ही में फ्रांस पहुँचे हैं और आपके पड़ोसी ने आपको 14 जुलाई को एक सैन्य परेड और आतिशबाजी देखने के लिए आमंत्रित किया है। इस दिन क्या मनाया जाता है?",
    explanation: "14 जुलाई फ्रांस का राष्ट्रीय दिवस है। यह 1789 में बास्तील की विजय की याद में मनाया जाता है, जो राजशाही की निरंकुशता के अंत और फ्रांसीसी क्रांति की शुरुआत का प्रतीक है। पूरे फ्रांस में सैन्य परेड, लोक उत्सव और आतिशबाजी आयोजित की जाती है।",
    choices: [
      { id: "a" as const, text: "राष्ट्रीय दिवस, बास्तील की विजय की स्मृति में" },
      { id: "b" as const, text: "द्वितीय विश्व युद्ध की समाप्ति" },
      { id: "c" as const, text: "पंचम गणराज्य के संविधान की वर्षगाँठ" },
      { id: "d" as const, text: "यूरोप दिवस" },
    ],
  },
  // S2
  {
    text: "11 नवंबर को, आपका नियोक्ता आपको बताता है कि कंपनी बंद है। आपकी नगरपालिका में शहीद स्मारक के सामने समारोह हो रहे हैं। यह दिन किसकी याद में मनाया जाता है?",
    explanation: "11 नवंबर एक सार्वजनिक अवकाश है जो 1918 के युद्धविराम की याद में मनाया जाता है, जिसने प्रथम विश्व युद्ध को समाप्त किया। युद्ध में शहीद सैनिकों को श्रद्धांजलि देने के लिए शहीद स्मारकों के सामने समारोह आयोजित किए जाते हैं।",
    choices: [
      { id: "a" as const, text: "द्वितीय विश्व युद्ध की समाप्ति" },
      { id: "b" as const, text: "अंतर्राष्ट्रीय शांति दिवस" },
      { id: "c" as const, text: "प्रथम विश्व युद्ध का युद्धविराम" },
      { id: "d" as const, text: "राष्ट्रीय स्मृति दिवस" },
    ],
  },
  // S3
  {
    text: "आप नगरपालिका भवन के सामने से गुजरते हैं और देखते हैं कि एक नीला, सफ़ेद और लाल झंडा लगा है। आपका बच्चा पूछता है कि यह क्या दर्शाता है। आप क्या जवाब देंगे?",
    explanation: "नीला, सफ़ेद और लाल तिरंगा झंडा फ्रांस का राष्ट्रीय प्रतीक है, जो संविधान में उल्लिखित है। नीला और लाल पेरिस के रंगों का प्रतिनिधित्व करते हैं, और सफ़ेद राजशाही का। यह फ्रांसीसी गणराज्य के मूल्यों का प्रतीक है।",
    choices: [
      { id: "a" as const, text: "यह फ्रांस का राष्ट्रीय ध्वज है, गणराज्य का प्रतीक" },
      { id: "b" as const, text: "यह गाँव के त्योहार के लिए एक सजावटी झंडा है" },
      { id: "c" as const, text: "यह क्षेत्र का झंडा है" },
      { id: "d" as const, text: "यह यूरोपीय संघ का झंडा है" },
    ],
  },
  // S4
  {
    text: "8 मई को, आप देखते हैं कि दुकानें बंद हैं और शहीद स्मारक पर पुष्पमालाएँ रखी गई हैं। एक पड़ोसी आपको समारोह में आमंत्रित करता है। 8 मई को क्या मनाया जाता है?",
    explanation: "8 मई 1945 यूरोप में द्वितीय विश्व युद्ध के अंत का प्रतीक है, जब नाजी जर्मनी ने आत्मसमर्पण किया। यह सार्वजनिक अवकाश उन सभी को श्रद्धांजलि देने का अवसर है जिन्होंने इस संघर्ष में लड़ाई लड़ी और कष्ट सहे।",
    choices: [
      { id: "a" as const, text: "1945 की विजय और यूरोप में द्वितीय विश्व युद्ध की समाप्ति" },
      { id: "b" as const, text: "रोम संधि पर हस्ताक्षर" },
      { id: "c" as const, text: "यूरोप दिवस" },
      { id: "d" as const, text: "पेरिस की मुक्ति की वर्षगाँठ" },
    ],
  },
  // S5
  {
    text: "नगरपालिका भवन में एक आधिकारिक समारोह के दौरान, जब एक गीत बजता है तो सभी खड़े हो जाते हैं। आपको बताया जाता है कि यह ला मार्सेइज़ है। इस गीत की क्या स्थिति है?",
    explanation: "ला मार्सेइज़ फ्रांस का राष्ट्रगान है, जो संविधान (अनुच्छेद 2) में उल्लिखित है। 1792 में रूजे दे लील द्वारा रचित, यह आधिकारिक समारोहों, अंतर्राष्ट्रीय खेल आयोजनों और स्मारक समारोहों में बजाया जाता है।",
    choices: [
      { id: "a" as const, text: "यह एक लोकप्रिय क्षेत्रीय गीत है" },
      { id: "b" as const, text: "यह सेना के लिए आरक्षित एक सैन्य गीत है" },
      { id: "c" as const, text: "यह यूरोपीय संघ का गान है" },
      { id: "d" as const, text: "यह फ्रांस का राष्ट्रगान है, जो संविधान में उल्लिखित है" },
    ],
  },
  // S6
  {
    text: "आप पेरिस में एक राष्ट्रीय संग्रहालय देखना चाहते हैं लेकिन आपका बजट सीमित है। एक दोस्त आपको बताता है कि कुछ दिन प्रवेश निःशुल्क होता है। कौन सी जानकारी सही है?",
    explanation: "फ्रांस के राष्ट्रीय संग्रहालय जैसे लूवर और ओर्से संग्रहालय हर महीने के पहले रविवार को निःशुल्क होते हैं। इसके अलावा, यूरोपीय संघ में रहने वाले 26 वर्ष से कम आयु के लोगों के लिए प्रवेश आमतौर पर निःशुल्क है।",
    choices: [
      { id: "a" as const, text: "राष्ट्रीय संग्रहालय हर महीने के पहले रविवार को निःशुल्क होते हैं" },
      { id: "b" as const, text: "संग्रहालय हमेशा सशुल्क होते हैं, बिना किसी अपवाद के" },
      { id: "c" as const, text: "केवल फ्रांसीसी नागरिक ही मुफ्त में प्रवेश कर सकते हैं" },
      { id: "d" as const, text: "संग्रहालय केवल 14 जुलाई को निःशुल्क होते हैं" },
    ],
  },
  // S7
  {
    text: "आप दोस्तों के साथ मोन-सेंट-मिशेल का दौरा कर रहे हैं और एक साइनबोर्ड देखते हैं जो बताता है कि यह यूनेस्को विश्व धरोहर स्थल है। इस मान्यता का क्या अर्थ है?",
    explanation: "यूनेस्को विश्व धरोहर में शामिल होना किसी सांस्कृतिक या प्राकृतिक स्थल के असाधारण सार्वभौमिक मूल्य को मान्यता देता है। फ्रांस में 50 से अधिक सूचीबद्ध स्थल हैं। इस मान्यता का अर्थ स्थल की बेहतर सुरक्षा और संरक्षण है।",
    choices: [
      { id: "a" as const, text: "यह स्थल अपने असाधारण सार्वभौमिक मूल्य के लिए मान्यता प्राप्त है और विशेष सुरक्षा प्राप्त करता है" },
      { id: "b" as const, text: "यह स्थल संयुक्त राष्ट्र का है" },
      { id: "c" as const, text: "यह स्थल विदेशी पर्यटकों के लिए आरक्षित है" },
      { id: "d" as const, text: "इसे संरक्षित करने के लिए जनता के लिए प्रतिबंधित है" },
    ],
  },
  // S8
  {
    text: "आपको फ्रांसीसी पड़ोसियों के यहाँ रात के खाने पर आमंत्रित किया गया है जो आपको एक पारंपरिक भोजन परोसते हैं - स्टार्टर, मुख्य व्यंजन, चीज़ और मिठाई। फ्रांसीसी पाक कला के बारे में कौन सा कथन सही है?",
    explanation: "फ्रांसीसी पारंपरिक भोजन 2010 से यूनेस्को की अमूर्त सांस्कृतिक विरासत सूची में शामिल है। व्यवस्थित भोजन की परंपरा (एपेरिटिफ़, स्टार्टर, मुख्य व्यंजन, चीज़, मिठाई) फ्रांस में संस्कृति और सामाजिक बंधन का एक महत्वपूर्ण हिस्सा है।",
    choices: [
      { id: "a" as const, text: "फ्रांसीसी पाक कला को कोई अंतर्राष्ट्रीय मान्यता नहीं है" },
      { id: "b" as const, text: "फ्रांसीसी व्यंजन केवल एक पेरिस की परंपरा है" },
      { id: "c" as const, text: "पारंपरिक फ्रांसीसी भोजन में केवल एक व्यंजन होता है" },
      { id: "d" as const, text: "फ्रांसीसी पारंपरिक भोजन यूनेस्को की अमूर्त विरासत सूची में शामिल है" },
    ],
  },
  // S9
  {
    text: "सितंबर में, आप यूरोपीय विरासत दिवस की घोषणा करने वाले पोस्टर देखते हैं। आम तौर पर जनता के लिए बंद रहने वाली इमारतें अपने दरवाज़े खोलती हैं। यह क्या है?",
    explanation: "यूरोपीय विरासत दिवस हर साल सितंबर में आयोजित किए जाते हैं। ये आम तौर पर जनता के लिए बंद स्थानों जैसे मंत्रालयों, महलों और ऐतिहासिक इमारतों का निःशुल्क भ्रमण कराते हैं। यह फ्रांस और यूरोप में एक प्रमुख सांस्कृतिक कार्यक्रम है।",
    choices: [
      { id: "a" as const, text: "क्षेत्रीय उत्पाद बेचने का एक व्यावसायिक कार्यक्रम" },
      { id: "b" as const, text: "एक यूरोपीय धार्मिक त्योहार" },
      { id: "c" as const, text: "एक वार्षिक कार्यक्रम जो आम तौर पर बंद विरासत स्थलों का निःशुल्क भ्रमण कराता है" },
      { id: "d" as const, text: "सार्वजनिक भवनों के नवीकरण कार्य का दिन" },
    ],
  },
  // S10
  {
    text: "आपका बच्चा स्कूल से लौटकर संग्रहालय भ्रमण और संगीत शिक्षा कक्षा के बारे में बताता है। फ्रांसीसी स्कूल इन सांस्कृतिक गतिविधियों को क्यों शामिल करता है?",
    explanation: "कलात्मक और सांस्कृतिक शिक्षा फ्रांस में स्कूल का एक मूलभूत कार्य है। इसका उद्देश्य सभी विद्यार्थियों को, उनकी सामाजिक पृष्ठभूमि चाहे जो हो, संस्कृति तक पहुँच प्रदान करना और उनकी कलात्मक संवेदनशीलता विकसित करना है। यह गणतांत्रिक समानता का एक स्तंभ है।",
    choices: [
      { id: "a" as const, text: "कलात्मक और सांस्कृतिक शिक्षा स्कूल का कार्य है ताकि सभी की संस्कृति तक पहुँच सुनिश्चित हो" },
      { id: "b" as const, text: "यह केवल बच्चों के मनोरंजन के लिए है" },
      { id: "c" as const, text: "यह सम्पन्न परिवारों के लिए आरक्षित एक सशुल्क गतिविधि है" },
      { id: "d" as const, text: "ये गतिविधियाँ वैकल्पिक हैं और शिक्षक की इच्छा पर निर्भर करती हैं" },
    ],
  },
  // S11
  {
    text: "आप नौकरी ढूंढ रहे हैं और फ्रांस के विभिन्न क्षेत्रों में नौकरी के प्रस्ताव देख रहे हैं। 2015 के सुधार के बाद मुख्य भूमि फ्रांस में कितने क्षेत्र हैं?",
    explanation: "2015 के क्षेत्रीय सुधार के बाद, मुख्य भूमि फ्रांस में 13 क्षेत्र हैं (पहले 22 के बजाय)। क्षेत्रों का प्रशासन एक निर्वाचित क्षेत्रीय परिषद द्वारा किया जाता है। वे क्षेत्रीय परिवहन, लाइसी (उच्च माध्यमिक विद्यालय) और आर्थिक विकास का प्रबंधन करती हैं।",
    choices: [
      { id: "a" as const, text: "22 क्षेत्र" },
      { id: "b" as const, text: "13 क्षेत्र" },
      { id: "c" as const, text: "18 क्षेत्र" },
      { id: "d" as const, text: "26 क्षेत्र" },
    ],
  },
  // S12
  {
    text: "ग्वाडेलूप से आए एक सहकर्मी आपको बताते हैं कि वे फ्रांसीसी हैं। आप आश्चर्यचकित हैं क्योंकि ग्वाडेलूप मुख्य भूमि से दूर है। समुद्रपारीय क्षेत्रों की कानूनी स्थिति क्या है?",
    explanation: "समुद्रपारीय विभाग और क्षेत्र जैसे ग्वाडेलूप, मार्टीनिक, गयाना, रीयूनियन और मायोट फ्रांसीसी गणराज्य के अभिन्न अंग हैं। उनके निवासी पूर्ण फ्रांसीसी नागरिक हैं, जिन्हें समान अधिकार और कर्तव्य प्राप्त हैं।",
    choices: [
      { id: "a" as const, text: "ये फ्रांस के सहयोगी स्वतंत्र देश हैं" },
      { id: "b" as const, text: "इनके निवासी फ्रांसीसी नागरिक नहीं हैं" },
      { id: "c" as const, text: "ये फ्रांसीसी गणराज्य के क्षेत्र हैं जिनके निवासी फ्रांसीसी नागरिक हैं" },
      { id: "d" as const, text: "ये बिना राजनीतिक अधिकारों वाले उपनिवेश हैं" },
    ],
  },
  // S13
  {
    text: "आप छुट्टियों में स्पेन जाना चाहते हैं। एक दोस्त आपको बताता है कि अगर आपके पास फ्रांसीसी निवास परमिट है तो पासपोर्ट की ज़रूरत नहीं है। यह कैसे संभव है?",
    explanation: "फ्रांस यूरोपीय संघ और शेंगेन क्षेत्र का सदस्य है, जो सदस्य देशों के बीच आंतरिक सीमा नियंत्रण के बिना लोगों की मुक्त आवाजाही की अनुमति देता है। एक वैध फ्रांसीसी निवास परमिट शेंगेन क्षेत्र में यात्रा करने की अनुमति देता है।",
    choices: [
      { id: "a" as const, text: "स्पेन और फ्रांस के बीच एक विशेष द्विपक्षीय समझौता है" },
      { id: "b" as const, text: "शेंगेन क्षेत्र की बदौलत जो सदस्य देशों के बीच मुक्त आवाजाही की अनुमति देता है" },
      { id: "c" as const, text: "यूरोप में कभी कोई सीमा नियंत्रण नहीं होता" },
      { id: "d" as const, text: "यह सच नहीं है, पासपोर्ट हमेशा अनिवार्य है" },
    ],
  },
  // S14
  {
    text: "आप अभी फ्रांस पहुँचे हैं और आपको अपना पैसा बदलना है। फ्रांस में कौन सी मुद्रा इस्तेमाल होती है और कब से?",
    explanation: "फ्रांस 1 जनवरी 2002 से यूरो (€) को अपनी मुद्रा के रूप में उपयोग करता है (सिक्कों और नोटों का प्रचलन)। यूरो यूरो ज़ोन की साझा मुद्रा है, जिसमें यूरोपीय संघ के 20 देश शामिल हैं। इसने फ्रेंच फ्रैंक की जगह ली।",
    choices: [
      { id: "a" as const, text: "फ्रेंच फ्रैंक, हमेशा से" },
      { id: "b" as const, text: "यूरोपीय डॉलर, 2010 से" },
      { id: "c" as const, text: "यूरो, 2002 से प्रचलन में" },
      { id: "d" as const, text: "पाउंड, ब्रेक्सिट के बाद से" },
    ],
  },
  // S15
  {
    text: "आपको एक आधिकारिक पत्र मिलता है जिसमें आपकी कम्यून और आपके विभाग का उल्लेख है। आप इन दो प्रशासनिक स्तरों के बीच अंतर नहीं समझते। कौन सी व्याख्या सही है?",
    explanation: "फ्रांस तीन स्तरों के स्थानीय प्राधिकरणों में संगठित है: कम्यून (मेयर द्वारा प्रशासित), विभाग (विभागीय परिषद द्वारा प्रशासित) और क्षेत्र (क्षेत्रीय परिषद द्वारा प्रशासित)। कम्यून नागरिकों के सबसे निकट का स्तर है।",
    choices: [
      { id: "a" as const, text: "कम्यून और विभाग एक ही चीज़ हैं" },
      { id: "b" as const, text: "विभाग कई कम्यूनों का समूह है, यह एक उच्च प्रशासनिक स्तर है" },
      { id: "c" as const, text: "2015 के सुधार के बाद विभाग अब अस्तित्व में नहीं है" },
      { id: "d" as const, text: "कम्यून विभाग से बड़ा है" },
    ],
  },
];

// ── Portuguese (pt) ─────────────────────────────────────────────────────────
export const sitTheme4Pt = [
  // S1
  {
    text: "Você acabou de chegar à França e seu vizinho o convida para assistir a um desfile militar e fogos de artifício no dia 14 de julho. O que é comemorado nesse dia?",
    explanation: "O 14 de julho é o feriado nacional francês. Ele comemora a tomada da Bastilha em 1789, símbolo do fim do absolutismo real e do início da Revolução Francesa. Desfiles militares, bailes populares e fogos de artifício são organizados em toda a França.",
    choices: [
      { id: "a" as const, text: "O feriado nacional, comemorando a tomada da Bastilha" },
      { id: "b" as const, text: "O fim da Segunda Guerra Mundial" },
      { id: "c" as const, text: "O aniversário da Constituição da Quinta República" },
      { id: "d" as const, text: "O Dia da Europa" },
    ],
  },
  // S2
  {
    text: "No dia 11 de novembro, seu empregador informa que a empresa está fechada. Cerimônias acontecem diante do monumento aos mortos da sua cidade. O que é comemorado nesse dia?",
    explanation: "O 11 de novembro é um feriado que comemora o armistício de 1918, marcando o fim da Primeira Guerra Mundial. Cerimônias são realizadas diante dos monumentos aos mortos para homenagear os soldados que tombaram em combate.",
    choices: [
      { id: "a" as const, text: "O fim da Segunda Guerra Mundial" },
      { id: "b" as const, text: "O Dia Internacional da Paz" },
      { id: "c" as const, text: "O armistício da Primeira Guerra Mundial" },
      { id: "d" as const, text: "O Dia Nacional da Lembrança" },
    ],
  },
  // S3
  {
    text: "Você passa em frente à prefeitura da sua cidade e nota uma bandeira azul, branca e vermelha pendurada na fachada. Seu filho pergunta o que ela representa. O que você responde?",
    explanation: "A bandeira tricolor azul, branca e vermelha é o emblema nacional da França, inscrito na Constituição. O azul e o vermelho representam as cores de Paris, e o branco a monarquia. Ela simboliza os valores da República Francesa.",
    choices: [
      { id: "a" as const, text: "É a bandeira nacional da França, símbolo da República" },
      { id: "b" as const, text: "É uma bandeira decorativa para a festa da cidade" },
      { id: "c" as const, text: "É a bandeira da região" },
      { id: "d" as const, text: "É a bandeira da União Europeia" },
    ],
  },
  // S4
  {
    text: "No dia 8 de maio, você percebe que as lojas estão fechadas e que coroas de flores foram depositadas ao pé do monumento aos mortos. Um vizinho o convida para a cerimônia. O que é comemorado no dia 8 de maio?",
    explanation: "O 8 de maio de 1945 marca o fim da Segunda Guerra Mundial na Europa, com a capitulação da Alemanha nazista. Esse feriado é uma ocasião para homenagear todos que combateram e sofreram durante esse conflito.",
    choices: [
      { id: "a" as const, text: "A vitória de 1945 e o fim da Segunda Guerra Mundial na Europa" },
      { id: "b" as const, text: "A assinatura do Tratado de Roma" },
      { id: "c" as const, text: "O Dia da Europa" },
      { id: "d" as const, text: "O aniversário da Libertação de Paris" },
    ],
  },
  // S5
  {
    text: "Durante uma cerimônia oficial na prefeitura, todos se levantam quando um hino é tocado. Explicam que é A Marselhesa. Qual é o status desse canto?",
    explanation: "A Marselhesa é o hino nacional da França, inscrito na Constituição (artigo 2). Composto por Rouget de Lisle em 1792, é executado em cerimônias oficiais, eventos esportivos internacionais e comemorações.",
    choices: [
      { id: "a" as const, text: "É um canto regional popular" },
      { id: "b" as const, text: "É um canto militar reservado ao exército" },
      { id: "c" as const, text: "É o hino da União Europeia" },
      { id: "d" as const, text: "É o hino nacional da França, inscrito na Constituição" },
    ],
  },
  // S6
  {
    text: "Você quer visitar um museu nacional em Paris, mas tem orçamento limitado. Um amigo diz que em certos dias a entrada é gratuita. Qual informação é correta?",
    explanation: "Os museus nacionais da França, como o Louvre e o Museu de Orsay, são gratuitos no primeiro domingo de cada mês. Além disso, a entrada é geralmente gratuita para menores de 26 anos residentes na União Europeia.",
    choices: [
      { id: "a" as const, text: "Os museus nacionais são gratuitos no primeiro domingo do mês" },
      { id: "b" as const, text: "Os museus são sempre pagos, sem exceção" },
      { id: "c" as const, text: "Apenas cidadãos franceses podem entrar de graça" },
      { id: "d" as const, text: "Os museus são gratuitos apenas no dia 14 de julho" },
    ],
  },
  // S7
  {
    text: "Você visita o Mont-Saint-Michel com amigos e vê uma placa indicando que é um Patrimônio Mundial da UNESCO. O que significa essa distinção?",
    explanation: "A classificação como Patrimônio Mundial da UNESCO reconhece o valor universal excepcional de um sítio cultural ou natural. A França possui mais de 50 sítios classificados. Essa distinção implica proteção e preservação reforçadas do local.",
    choices: [
      { id: "a" as const, text: "O local é reconhecido por seu valor universal excepcional e recebe proteção especial" },
      { id: "b" as const, text: "O local pertence à Organização das Nações Unidas" },
      { id: "c" as const, text: "O local é reservado para turistas estrangeiros" },
      { id: "d" as const, text: "O local é proibido ao público para preservá-lo" },
    ],
  },
  // S8
  {
    text: "Você é convidado para jantar na casa de vizinhos franceses que lhe oferecem uma refeição típica com entrada, prato principal, queijo e sobremesa. Qual afirmação é verdadeira sobre a gastronomia francesa?",
    explanation: "A refeição gastronômica dos franceses foi inscrita no patrimônio cultural imaterial da UNESCO em 2010. A tradição da refeição estruturada (aperitivo, entrada, prato, queijo, sobremesa) é um elemento importante da cultura e dos laços sociais na França.",
    choices: [
      { id: "a" as const, text: "A gastronomia francesa não tem nenhum reconhecimento internacional" },
      { id: "b" as const, text: "A culinária francesa é apenas uma tradição parisiense" },
      { id: "c" as const, text: "A refeição francesa tradicional tem apenas um prato" },
      { id: "d" as const, text: "A refeição gastronômica francesa é inscrita no patrimônio imaterial da UNESCO" },
    ],
  },
  // S9
  {
    text: "Em setembro, você vê cartazes anunciando as Jornadas Europeias do Patrimônio. Prédios normalmente fechados ao público abrem suas portas. Do que se trata?",
    explanation: "As Jornadas Europeias do Patrimônio acontecem todo ano em setembro. Permitem visitar gratuitamente locais normalmente fechados ao público: ministérios, palácios, prédios históricos. É um evento cultural importante na França e na Europa.",
    choices: [
      { id: "a" as const, text: "Um evento comercial para vender produtos regionais" },
      { id: "b" as const, text: "Uma festa religiosa europeia" },
      { id: "c" as const, text: "Um evento anual que permite visitar gratuitamente locais patrimoniais normalmente fechados" },
      { id: "d" as const, text: "Um dia de obras de renovação de prédios públicos" },
    ],
  },
  // S10
  {
    text: "Seu filho volta da escola contando sobre um passeio escolar ao museu e uma aula de educação musical. Por que a escola francesa inclui essas atividades culturais?",
    explanation: "A educação artística e cultural é uma missão fundamental da escola na França. Ela visa permitir que todos os alunos, independentemente de sua origem social, tenham acesso à cultura e desenvolvam sua sensibilidade artística. É um pilar da igualdade republicana.",
    choices: [
      { id: "a" as const, text: "A educação artística e cultural é uma missão da escola para garantir o acesso de todos à cultura" },
      { id: "b" as const, text: "É apenas para entreter as crianças" },
      { id: "c" as const, text: "É uma atividade paga reservada a famílias abastadas" },
      { id: "d" as const, text: "Essas atividades são opcionais e dependem da vontade do professor" },
    ],
  },
  // S11
  {
    text: "Você procura emprego e consulta ofertas em diferentes regiões da França. Quantas regiões metropolitanas a França tem desde a reforma de 2015?",
    explanation: "Desde a reforma territorial de 2015, a França metropolitana conta com 13 regiões (em vez de 22 anteriormente). As regiões são dirigidas por um conselho regional eleito. Elas administram o transporte regional, os liceus e o desenvolvimento econômico.",
    choices: [
      { id: "a" as const, text: "22 regiões" },
      { id: "b" as const, text: "13 regiões" },
      { id: "c" as const, text: "18 regiões" },
      { id: "d" as const, text: "26 regiões" },
    ],
  },
  // S12
  {
    text: "Um colega originário de Guadalupe explica que é francês. Você se surpreende porque Guadalupe fica longe da metrópole. Qual é a situação jurídica dos territórios ultramarinos?",
    explanation: "Os departamentos e regiões ultramarinos como Guadalupe, Martinica, Guiana, Reunião e Mayotte fazem parte integrante da República Francesa. Seus habitantes são cidadãos franceses de pleno direito, com os mesmos direitos e deveres.",
    choices: [
      { id: "a" as const, text: "São países independentes aliados da França" },
      { id: "b" as const, text: "Seus habitantes não são cidadãos franceses" },
      { id: "c" as const, text: "São territórios da República Francesa cujos habitantes são cidadãos franceses" },
      { id: "d" as const, text: "São colônias sem direitos políticos" },
    ],
  },
  // S13
  {
    text: "Você quer viajar para a Espanha nas férias. Um amigo diz que não precisa de passaporte se tiver autorização de residência francesa. Por que isso é possível?",
    explanation: "A França é membro da União Europeia e do espaço Schengen, que permite a livre circulação de pessoas entre os países membros sem controle nas fronteiras internas. Uma autorização de residência francesa válida permite viajar no espaço Schengen.",
    choices: [
      { id: "a" as const, text: "Espanha e França têm um acordo bilateral especial" },
      { id: "b" as const, text: "Graças ao espaço Schengen que permite a livre circulação entre países membros" },
      { id: "c" as const, text: "Nunca há controle de fronteiras na Europa" },
      { id: "d" as const, text: "Isso não é verdade, o passaporte é sempre obrigatório" },
    ],
  },
  // S14
  {
    text: "Você acabou de chegar à França e precisa trocar seu dinheiro. Qual é a moeda usada na França e desde quando?",
    explanation: "A França usa o euro (€) como moeda desde 1º de janeiro de 2002 (entrada em circulação de moedas e cédulas). O euro é a moeda comum da zona do euro, que reúne 20 países da União Europeia. Ele substituiu o franco francês.",
    choices: [
      { id: "a" as const, text: "O franco francês, desde sempre" },
      { id: "b" as const, text: "O dólar europeu, desde 2010" },
      { id: "c" as const, text: "O euro, em circulação desde 2002" },
      { id: "d" as const, text: "A libra, desde o Brexit" },
    ],
  },
  // S15
  {
    text: "Você recebe uma correspondência oficial que menciona sua comuna e seu departamento. Não entende a diferença entre esses dois níveis administrativos. Qual explicação está correta?",
    explanation: "A França é organizada em três níveis de coletividades territoriais: a comuna (administrada pelo prefeito), o departamento (administrado pelo conselho departamental) e a região (administrada pelo conselho regional). A comuna é o nível mais próximo dos cidadãos.",
    choices: [
      { id: "a" as const, text: "A comuna e o departamento são a mesma coisa" },
      { id: "b" as const, text: "O departamento é um agrupamento de vários municípios, é um nível administrativo superior" },
      { id: "c" as const, text: "O departamento não existe mais desde a reforma de 2015" },
      { id: "d" as const, text: "A comuna é maior que o departamento" },
    ],
  },
];

// ============================================================================
// Theme 5 – Vie quotidienne en France (30 situational questions)
// ============================================================================

// ── Arabic (ar) ─────────────────────────────────────────────────────────────
export const sitTheme5Ar = [
  // S1
  {
    text: "زوجتك وضعت مولوداً في المستشفى. قيل لك إنه يجب عليك التصريح بالولادة. أين وفي أي مهلة يجب القيام بذلك؟",
    explanation: "يجب التصريح بالولادة في بلدية مكان الولادة خلال 5 أيام من الوضع. هذا التصريح إلزامي ويسمح بإصدار شهادة ميلاد الطفل، وهي ضرورية لجميع الإجراءات الإدارية.",
    choices: [
      { id: "a" as const, text: "في بلدية مكان الولادة، خلال 5 أيام" },
      { id: "b" as const, text: "في المحافظة، خلال 30 يوماً" },
      { id: "c" as const, text: "في المستشفى، في نفس اليوم" },
      { id: "d" as const, text: "في القنصلية، خلال 15 يوماً" },
    ],
  },
  // S2
  {
    text: "وصلت حديثاً إلى فرنسا وبدأت العمل. يسألك صاحب العمل إن كان لديك بطاقة فيتال. ما فائدة هذه البطاقة؟",
    explanation: "بطاقة فيتال هي بطاقة التأمين الصحي للضمان الاجتماعي. تسمح باسترداد تكاليف الرعاية الطبية. يجب تقديمها عند الطبيب وفي الصيدلية والمستشفى لتغطية التكاليف.",
    choices: [
      { id: "a" as const, text: "هي بطاقة نقل عام" },
      { id: "b" as const, text: "هي بطاقة هوية مهنية" },
      { id: "c" as const, text: "هي بطاقة مصرفية للموظفين الحكوميين" },
      { id: "d" as const, text: "هي بطاقة التأمين الصحي التي تسمح باسترداد تكاليف العلاج" },
    ],
  },
  // S3
  {
    text: "حصلت للتو على الجنسية الفرنسية وترغب في التصويت في الانتخابات القادمة. ما الإجراء الذي يجب اتخاذه؟",
    explanation: "للتصويت في فرنسا، يجب أن تكون مسجلاً في اللوائح الانتخابية لبلديتك. يمكن التسجيل في البلدية أو عبر الإنترنت على service-public.fr أو بالبريد. عادةً يُسجل حاملو الجنسية الجدد تلقائياً، لكن يُنصح بالتحقق.",
    choices: [
      { id: "a" as const, text: "الذهاب إلى المحافظة يوم التصويت" },
      { id: "b" as const, text: "لا حاجة لأي إجراء، يمكن للأجانب المقيمين بصفة نظامية التصويت" },
      { id: "c" as const, text: "التحقق من تسجيلك في اللوائح الانتخابية لدى بلديتك" },
      { id: "d" as const, text: "طلب تصريح خاص من المحكمة" },
    ],
  },
  // S4
  {
    text: "تنتهي صلاحية تصريح إقامتك خلال ثلاثة أشهر. ما الذي يجب فعله لتجديده؟",
    explanation: "يجب طلب تجديد تصريح الإقامة قبل 2 إلى 4 أشهر من انتهاء صلاحيته، لدى محافظة أو محافظة فرعية بمكان إقامتك. يتم الطلب عموماً عبر الإنترنت على موقع ANEF.",
    choices: [
      { id: "a" as const, text: "الانتظار حتى ينتهي التصريح لتقديم الطلب" },
      { id: "b" as const, text: "الاتصال بسفارة فرنسا في بلدك الأصلي" },
      { id: "c" as const, text: "الطلب من صاحب العمل أن يتولى الأمر" },
      { id: "d" as const, text: "تقديم طلب التجديد لدى المحافظة قبل انتهاء الصلاحية" },
    ],
  },
  // S5
  {
    text: "تتلقى رسالة من المحافظة تطلب منك تقديم مستندات إضافية لملفك. ما الذي يجب فعله؟",
    explanation: "عندما تطلب المحافظة وثائق تكميلية، يجب الرد في المواعيد المحددة حتماً. عدم الرد قد يؤدي إلى رفض طلبك. في حالة صعوبة، يمكنك الاتصال بالمحافظة أو طلب مساعدة جمعية.",
    choices: [
      { id: "a" as const, text: "تجاهل الرسالة، ستتواصل المحافظة معك لاحقاً" },
      { id: "b" as const, text: "تقديم شكوى لأن المحافظة تضايقك" },
      { id: "c" as const, text: "تقديم المستندات المطلوبة في المواعيد المحددة" },
      { id: "d" as const, text: "الانتظار حتى يكون لديك محامٍ للرد" },
    ],
  },
  // S6
  {
    text: "انتقلت للتو إلى مدينة جديدة. ما الجهات التي يجب إبلاغها بتغيير عنوانك؟",
    explanation: "عند الانتقال، يجب إبلاغ العديد من الجهات: المحافظة (إذا كان لديك تصريح إقامة)، الضمان الاجتماعي، صندوق التعويضات العائلية، الضرائب، البنك، ومكتب البريد. يوفر موقع service-public.fr خدمة تغيير العنوان عبر الإنترنت.",
    choices: [
      { id: "a" as const, text: "مكتب البريد فقط لتتبع المراسلات" },
      { id: "b" as const, text: "لا جهة، التغيير يتم تلقائياً" },
      { id: "c" as const, text: "بلدية مدينتك الجديدة فقط" },
      { id: "d" as const, text: "المحافظة والضمان الاجتماعي وصندوق التعويضات والضرائب والبنك وغيرها" },
    ],
  },
  // S7
  {
    text: "تحتاج إلى إجراء معاملة إدارية ولا تعرف أين تستعلم. ينصحك صديق بموقع حكومي رسمي. أي موقع؟",
    explanation: "موقع service-public.fr هو الموقع الرسمي للإدارة الفرنسية. يجمع كل المعلومات عن الإجراءات الإدارية والحقوق والالتزامات. كما يسمح بإنجاز بعض الإجراءات عبر الإنترنت.",
    choices: [
      { id: "a" as const, text: "www.google.fr" },
      { id: "b" as const, text: "www.facebook.com" },
      { id: "c" as const, text: "www.service-public.fr" },
      { id: "d" as const, text: "www.wikipedia.org" },
    ],
  },
  // S8
  {
    text: "ترغب في الزواج في فرنسا وتطلب منك البلدية شهادة ميلاد لا يزيد عمرها عن 3 أشهر. ولدت في الخارج. أين يجب طلب هذه الوثيقة؟",
    explanation: "إذا ولدت في الخارج وتم تسجيل ولادتك في السجلات الفرنسية، يمكنك طلب شهادة ميلادك من المصلحة المركزية للحالة المدنية في نانت. وإلا يجب تقديم شهادة ميلاد أجنبية مترجمة ومصدقة.",
    choices: [
      { id: "a" as const, text: "في بلدية مكان إقامتك في فرنسا" },
      { id: "b" as const, text: "في مديرية الشرطة" },
      { id: "c" as const, text: "في المحكمة الابتدائية الكبرى" },
      { id: "d" as const, text: "في المصلحة المركزية للحالة المدنية في نانت أو لدى سلطات بلدك الأصلي" },
    ],
  },
  // S9
  {
    text: "جارك المسن يشكو من آلام شديدة في الصدر ويعاني صعوبة في التنفس. تعتقد أنه يعاني من أزمة قلبية. أي رقم يجب الاتصال به بشكل عاجل؟",
    explanation: "الرقم 15 هو رقم خدمة المساعدة الطبية العاجلة (SAMU). يجب الاتصال به في أي حالة طبية طارئة: أزمة قلبية، سكتة دماغية، حادث خطير. يرسل SAMU فريقاً طبياً ويمكنه تفعيل تدخل رجال الإطفاء.",
    choices: [
      { id: "a" as const, text: "17 (الشرطة)" },
      { id: "b" as const, text: "15 (SAMU)" },
      { id: "c" as const, text: "18 (الإطفاء)" },
      { id: "d" as const, text: "3114 (الوقاية من الانتحار)" },
    ],
  },
  // S10
  {
    text: "عند عودتك إلى المنزل مساءً، تكتشف أن باب شقتك قد كُسر وأن أشياء اختفت. أي رقم يجب الاتصال به؟",
    explanation: "الرقم 17 هو رقم نجدة الشرطة (أو الدرك في المناطق الريفية). يجب الاتصال به في حالة جريمة جارية أو حديثة: سرقة، اعتداء، عنف. لا تلمس شيئاً في المكان وانتظر وصول قوات الأمن.",
    choices: [
      { id: "a" as const, text: "15 (SAMU)" },
      { id: "b" as const, text: "17 (نجدة الشرطة)" },
      { id: "c" as const, text: "18 (الإطفاء)" },
      { id: "d" as const, text: "12 (الاستعلامات الهاتفية)" },
    ],
  },
  // S11
  {
    text: "تشم رائحة دخان قوية في عمارتك وترى دخاناً يخرج من شقة مجاورة. أي رقم تتصل به أولاً؟",
    explanation: "الرقم 18 هو رقم الإطفاء. يجب الاتصال به في حالة حريق أو حادث مرور أو فيضان أو أي حالة تتطلب إنقاذاً. في حالة الشك، الرقم 112 (رقم الطوارئ الأوروبي) يعمل أيضاً.",
    choices: [
      { id: "a" as const, text: "18 (الإطفاء)" },
      { id: "b" as const, text: "15 (SAMU)" },
      { id: "c" as const, text: "17 (الشرطة)" },
      { id: "d" as const, text: "مدير العمارة" },
    ],
  },
  // S12
  {
    text: "أنت شاهد على حادث مرور في فرنسا لكنك لا تتذكر أرقام الطوارئ الفرنسية. أي رقم موحد يمكنك الاتصال به ويعمل في جميع أنحاء أوروبا؟",
    explanation: "الرقم 112 هو رقم الطوارئ الأوروبي. يعمل في جميع دول الاتحاد الأوروبي، مجاناً وعلى مدار الساعة. يسمح بالاتصال بخدمات الإنقاذ من أي هاتف حتى بدون شريحة اتصال.",
    choices: [
      { id: "a" as const, text: "911" },
      { id: "b" as const, text: "112" },
      { id: "c" as const, text: "999" },
      { id: "d" as const, text: "114" },
    ],
  },
  // S13
  {
    text: "تسجل في الضمان الاجتماعي ويُطلب منك اختيار طبيب معالج. لماذا هذا مهم؟",
    explanation: "الطبيب المعالج هو الطبيب الذي تستشيره أولاً لأي مشكلة صحية. ينسق مسار علاجك ويوجهك للأخصائيين عند الحاجة. بدون طبيب معالج مُصرح به، يكون استرداد تكاليف العلاج من الضمان الاجتماعي أقل.",
    choices: [
      { id: "a" as const, text: "هذا إلزامي فقط للأطفال" },
      { id: "b" as const, text: "هذا اختياري وليس له تأثير على الاسترداد" },
      { id: "c" as const, text: "الطبيب المعالج هو فقط أخصائي" },
      { id: "d" as const, text: "الطبيب المعالج ينسق علاجك ويتيح استرداداً أفضل" },
    ],
  },
  // S14
  {
    text: "يكسر طفلك ذراعه بعد سقوطه في الحديقة يوم الأحد. طبيبك المعالج لا يعمل يوم الأحد. أين يجب أخذه؟",
    explanation: "في حالة طوارئ طبية عندما لا يتوفر الطبيب المعالج، يمكنك التوجه إلى قسم الطوارئ في أقرب مستشفى. في فرنسا، تعمل أقسام الطوارئ على مدار الساعة طوال أيام الأسبوع. يمكنك أيضاً الاتصال بالرقم 15 للحصول على استشارة طبية.",
    choices: [
      { id: "a" as const, text: "الانتظار حتى يوم الاثنين لرؤية الطبيب المعالج" },
      { id: "b" as const, text: "التوجه مباشرة إلى قسم الطوارئ في أقرب مستشفى" },
      { id: "c" as const, text: "الاتصال بالبلدية للحصول على موعد" },
      { id: "d" as const, text: "الذهاب إلى الصيدلية لطلب جبيرة" },
    ],
  },
  // S15
  {
    text: "الساعة 11 مساءً وتحتاج إلى دواء عاجل وصفه الطبيب. جميع صيدليات حيك مغلقة. ما الذي يمكنك فعله؟",
    explanation: "في فرنسا، يوجد نظام صيدليات مناوبة يضمن صرف الأدوية ليلاً وأيام الأحد والعطل الرسمية. للعثور على أقرب صيدلية مناوبة، يمكنك الاتصال بالرقم 3237 أو زيارة موقع نقابة الصيادلة.",
    choices: [
      { id: "a" as const, text: "الانتظار حتى صباح اليوم التالي" },
      { id: "b" as const, text: "طلب الدواء عبر الإنترنت" },
      { id: "c" as const, text: "البحث عن الصيدلية المناوبة بالاتصال بالرقم 3237" },
      { id: "d" as const, text: "الذهاب إلى الطوارئ للحصول على الدواء" },
    ],
  },
  // S16
  {
    text: "وصلت حديثاً إلى فرنسا مع طفلك البالغ 7 سنوات. ترغب في تسجيله في المدرسة. أين يجب أن تتوجه أولاً؟",
    explanation: "لتسجيل طفل في المدرسة الابتدائية، يجب أولاً التوجه إلى بلدية مكان إقامتك للحصول على شهادة تسجيل، ثم التقدم إلى المدرسة بهذه الشهادة. المدرسة إلزامية في فرنسا من 3 إلى 16 عاماً مهما كانت جنسية الطفل.",
    choices: [
      { id: "a" as const, text: "إلى بلدية مكان إقامتك للحصول على شهادة تسجيل" },
      { id: "b" as const, text: "مباشرة إلى أقرب مدرسة" },
      { id: "c" as const, text: "إلى المحافظة لطلب تصريح" },
      { id: "d" as const, text: "إلى رئاسة الأكاديمية التعليمية" },
    ],
  },
  // S17
  {
    text: "يخبرك جارك أن طفله البالغ 4 سنوات ليس بحاجة للذهاب إلى المدرسة لأنه صغير جداً. هل هو محق؟",
    explanation: "لا. منذ عام 2019، التعليم إلزامي في فرنسا من سن 3 سنوات (وحتى 16 عاماً). أي طفل مقيم في فرنسا، مهما كانت جنسيته، يجب أن يكون مسجلاً في مؤسسة تعليمية أو يتلقى تعليماً منزلياً.",
    choices: [
      { id: "a" as const, text: "نعم، المدرسة إلزامية فقط من سن 6 سنوات" },
      { id: "b" as const, text: "نعم، المدرسة إلزامية فقط من سن 5 سنوات" },
      { id: "c" as const, text: "لا، التعليم إلزامي من سن 3 سنوات في فرنسا" },
      { id: "d" as const, text: "لا، التعليم إلزامي من سن سنتين في فرنسا" },
    ],
  },
  // S18
  {
    text: "ابنتك البالغة 14 عاماً تريد ارتداء رمز ديني ظاهر في المدرسة العامة. تخبرها المدرسة أن هذا غير مسموح. هل هذا قانوني؟",
    explanation: "نعم، هذا قانوني. يحظر قانون 15 مارس 2004 ارتداء رموز أو ملابس تظهر بوضوح الانتماء الديني في المدارس والمتوسطات والثانويات العامة. ينطبق هذا القانون على جميع الأديان ويهدف إلى الحفاظ على العلمانية في المحيط المدرسي.",
    choices: [
      { id: "a" as const, text: "لا، هذا تمييز ديني" },
      { id: "b" as const, text: "نعم، القانون يحظر الرموز الدينية الظاهرة في المدارس العامة" },
      { id: "c" as const, text: "يعتمد ذلك على الدين المعني" },
      { id: "d" as const, text: "هذا يخص المعلمين فقط وليس التلاميذ" },
    ],
  },
  // S19
  {
    text: "تدعوك مدرسة طفلك إلى اجتماع أولياء الأمور والمعلمين. لا تتحدث الفرنسية جيداً وتتردد في الذهاب. ما الذي ينبغي عليك فعله؟",
    explanation: "من المهم حضور اجتماعات أولياء الأمور والمعلمين لمتابعة دراسة طفلك. إذا لم تكن تتقن الفرنسية، يمكنك اصطحاب شخص يترجم لك، أو سؤال المدرسة عن وجود خدمة ترجمة.",
    choices: [
      { id: "a" as const, text: "عدم الذهاب لأنك لن تفهم شيئاً" },
      { id: "b" as const, text: "الذهاب برفقة شخص يمكنه الترجمة لك" },
      { id: "c" as const, text: "إرسال رسالة لتوضيح أنك لا تستطيع الحضور" },
      { id: "d" as const, text: "الانتظار حتى ينقل طفلك المعلومات إليك" },
    ],
  },
  // S20
  {
    text: "يعود طفلك من المدرسة باكياً ويخبرك أن زملاء يضربونه ويشتمونه بانتظام. ما الذي يجب فعله؟",
    explanation: "التنمر المدرسي جريمة في فرنسا. يجب إبلاغ مدير المدرسة أو رئيس المؤسسة. يمكنك أيضاً الاتصال بالرقم 3020 (الرقم الوطني لمكافحة التنمر المدرسي). المدرسة ملزمة بحماية التلاميذ واتخاذ إجراءات.",
    choices: [
      { id: "a" as const, text: "أخبر طفلك أن يدافع عن نفسه وحده" },
      { id: "b" as const, text: "الاتصال بأولياء أمور الأطفال المعنيين لحل المشكلة" },
      { id: "c" as const, text: "الإبلاغ عن الوضع لمدير المدرسة والاتصال بالرقم 3020 عند الحاجة" },
      { id: "d" as const, text: "نقل طفلك إلى مدرسة أخرى دون إخبار أحد" },
    ],
  },
  // S21
  {
    text: "ترغب في تسجيل طفلك في مطعم المدرسة لكن دخلك محدود. كيف يُحسب السعر؟",
    explanation: "في معظم البلديات، يُحسب سعر مطعم المدرسة وفقاً لدخل الأسرة (الحاصل العائلي). تدفع الأسر ذات الدخل الأدنى أقل سعر. لا يمكن استبعاد أي طفل من المطعم لأسباب مالية.",
    choices: [
      { id: "a" as const, text: "السعر نفسه للجميع بدون استثناء" },
      { id: "b" as const, text: "المطعم المدرسي مجاني دائماً في فرنسا" },
      { id: "c" as const, text: "يُحسب السعر وفقاً لدخل الأسرة" },
      { id: "d" as const, text: "فقط أطفال الجنسية الفرنسية يمكنهم الاستفادة" },
    ],
  },
  // S22
  {
    text: "طفلك مريض ولا يستطيع الذهاب إلى المدرسة لعدة أيام. ما هو واجبك كولي أمر؟",
    explanation: "يجب على أولياء الأمور إبلاغ المدرسة من أول يوم غياب وتقديم مبرر (شهادة طبية، رسالة عذر). الغيابات غير المبررة المتكررة قد تؤدي إلى إبلاغ السلطات، لأن التعليم إلزامي في فرنسا.",
    choices: [
      { id: "a" as const, text: "لا شيء، المدرسة ستفهم" },
      { id: "b" as const, text: "إبلاغ المدرسة من أول يوم وتقديم مبرر" },
      { id: "c" as const, text: "إرسال رسالة إلى الأكاديمية التعليمية" },
      { id: "d" as const, text: "الانتظار حتى تتصل بك المدرسة" },
    ],
  },
  // S23
  {
    text: "وصلت حديثاً إلى فرنسا وتتساءل هل تسجيل طفلك في المدرسة العامة مدفوع. ما هي القاعدة في فرنسا؟",
    explanation: "التعليم في المدارس العامة مجاني في فرنسا من الروضة حتى الثانوية. هذا مبدأ أساسي في المدرسة الجمهورية. تُقدم الكتب المدرسية عموماً. لكن بعض اللوازم المدرسية تبقى على عاتق الأسر.",
    choices: [
      { id: "a" as const, text: "المدرسة العامة مجانية لجميع الأطفال المقيمين في فرنسا" },
      { id: "b" as const, text: "المدرسة العامة مدفوعة للأسر الأجنبية" },
      { id: "c" as const, text: "المدرسة مجانية فقط ابتداءً من المتوسطة" },
      { id: "d" as const, text: "رسوم التعليم تعتمد على الجنسية" },
    ],
  },
  // S24
  {
    text: "فقدت عملك في فرنسا. ينصحك صديق بالتسجيل في فرنس ترافاي (بول أمبلوا سابقاً). لماذا هذا مهم؟",
    explanation: "فرنس ترافاي هو مرفق التوظيف العام في فرنسا. التسجيل يسمح بالاستفادة من مرافقة في البحث عن عمل وتدريبات، وربما تعويض بطالة إذا كنت قد ساهمت بما يكفي.",
    choices: [
      { id: "a" as const, text: "هذا إلزامي فقط للمواطنين الفرنسيين" },
      { id: "b" as const, text: "التسجيل يسمح بالمرافقة في البحث عن عمل والحصول على تعويضات بطالة" },
      { id: "c" as const, text: "فرنس ترافاي وكالة توظيف مؤقت خاصة" },
      { id: "d" as const, text: "التسجيل مفيد فقط إذا كنت تبحث عن وظيفة حكومية" },
    ],
  },
  // S25
  {
    text: "عُرض عليك عمل بدوام كامل لكن الراتب المقترح يبدو منخفضاً جداً. هل يوجد حد أدنى للأجور في فرنسا؟",
    explanation: "نعم، SMIC هو الحد الأدنى القانوني للأجر بالساعة في فرنسا. لا يمكن أن يتقاضى أي موظف بالغ أقل من SMIC. يُعاد تقييمه كل عام. يمكنك التحقق من المبلغ الحالي على service-public.fr.",
    choices: [
      { id: "a" as const, text: "لا، لا يوجد حد أدنى للأجور في فرنسا" },
      { id: "b" as const, text: "الحد الأدنى موجود لكنه يسري فقط على الفرنسيين" },
      { id: "c" as const, text: "نعم، SMIC هو الحد الأدنى القانوني للأجر ينطبق على جميع الموظفين" },
      { id: "d" as const, text: "الحد الأدنى للأجر تحدده كل شركة" },
    ],
  },
  // S26
  {
    text: "تبدأ عملاً جديداً ويسلمك صاحب العمل عقد عمل. ما العناصر الأساسية التي يجب أن يتضمنها؟",
    explanation: "يجب أن يتضمن عقد العمل على الأقل: هوية الطرفين، المنصب، مدة العمل، الأجر، مكان العمل، تاريخ البدء والاتفاقية الجماعية المطبقة. للعقود المحددة المدة، يجب تحديد المدة وسبب التعاقد.",
    choices: [
      { id: "a" as const, text: "الراتب والدوام فقط" },
      { id: "b" as const, text: "عقد العمل غير إلزامي في فرنسا" },
      { id: "c" as const, text: "اسم الشركة وتوقيعك فقط" },
      { id: "d" as const, text: "المنصب والمدة والراتب ومكان العمل والاتفاقية الجماعية وغيرها" },
    ],
  },
  // S27
  {
    text: "في العمل، يرفض مديرك منحك ترقية بسبب أصلك. ما الذي يمكنك فعله؟",
    explanation: "التمييز على أساس الأصل محظور بموجب القانون في فرنسا (قانون العمل والقانون الجنائي). يمكنك اللجوء إلى مدافع الحقوق، أو تقديم شكوى للشرطة أو النيابة، أو الاتصال بممثلي العمال أو نقابة، أو اللجوء إلى مجلس العمال.",
    choices: [
      { id: "a" as const, text: "قبول الوضع لأن صاحب العمل دائماً على حق" },
      { id: "b" as const, text: "الاستقالة فوراً" },
      { id: "c" as const, text: "عدم فعل أي شيء لأن القانون لا يحمي من هذا النوع من التمييز" },
      { id: "d" as const, text: "اللجوء إلى مدافع الحقوق أو تقديم شكوى أو الاتصال بنقابة" },
    ],
  },
  // S28
  {
    text: "تعمل منذ عام في شركة وترغب في أخذ إجازة. هل لديك الحق في إجازة مدفوعة؟",
    explanation: "في فرنسا، لكل موظف الحق في 5 أسابيع إجازة مدفوعة سنوياً (أي 2.5 يوم عمل عن كل شهر عمل). هذا الحق مكفول بموجب قانون العمل. لا يمكن لصاحب العمل رفض الإجازة المدفوعة.",
    choices: [
      { id: "a" as const, text: "نعم، لكل موظف الحق في 5 أسابيع إجازة مدفوعة سنوياً" },
      { id: "b" as const, text: "لا، الإجازة المدفوعة تُمنح فقط بعد 5 سنوات خبرة" },
      { id: "c" as const, text: "الإجازة المدفوعة مخصصة للمدراء فقط" },
      { id: "d" as const, text: "الإجازة المدفوعة موجودة فقط في القطاع العام" },
    ],
  },
  // S29
  {
    text: "يحدثك زميل عن النقابات ويقترح عليك الانضمام. هل يمكن لصاحب العمل منعك من الانضمام إلى نقابة؟",
    explanation: "لا. حرية الانتماء النقابي حق أساسي مكفول بالدستور الفرنسي وقانون العمل. كل موظف حر في الانضمام أو عدم الانضمام إلى نقابة. لا يمكن لصاحب العمل معاقبة أو التمييز ضد موظف بسبب انتمائه النقابي.",
    choices: [
      { id: "a" as const, text: "نعم، يمكن لصاحب العمل حظر أي نشاط نقابي" },
      { id: "b" as const, text: "النقابات مخصصة للموظفين من الجنسية الفرنسية" },
      { id: "c" as const, text: "لا، حرية الانتماء النقابي حق دستوري ولا يمكن لصاحب العمل منعه" },
      { id: "d" as const, text: "فقط موظفو القطاع العام لهم الحق في الانضمام إلى نقابة" },
    ],
  },
  // S30
  {
    text: "يخبرك زملاء بأنهم سيضربون عن العمل للمطالبة بزيادة في الرواتب. تتساءل هل هذا قانوني في فرنسا. ماذا يقول القانون؟",
    explanation: "حق الإضراب حق دستوري في فرنسا، معترف به في مقدمة دستور 1946. يمكن لأي موظف المشاركة في إضراب للدفاع عن مصالحه المهنية. لا يمكن لصاحب العمل فصل موظف لأنه أضرب.",
    choices: [
      { id: "a" as const, text: "الإضراب غير قانوني في فرنسا" },
      { id: "b" as const, text: "الإضراب مسموح فقط في القطاع العام" },
      { id: "c" as const, text: "النقابات فقط يمكنها تقرير الإضراب" },
      { id: "d" as const, text: "حق الإضراب حق دستوري لجميع الموظفين" },
    ],
  },
];

// ── Spanish (es) ────────────────────────────────────────────────────────────
export const sitTheme5Es = [
  // S1
  {
    text: "Su esposa acaba de dar a luz en el hospital. Le dicen que debe declarar el nacimiento. ¿Dónde y en qué plazo debe hacerlo?",
    explanation: "La declaración de nacimiento debe realizarse en el ayuntamiento del lugar de nacimiento dentro de los 5 días siguientes al parto. Es obligatoria y permite establecer el acta de nacimiento del niño, indispensable para todos los trámites administrativos.",
    choices: [
      { id: "a" as const, text: "En el ayuntamiento del lugar de nacimiento, dentro de 5 días" },
      { id: "b" as const, text: "En la prefectura, dentro de 30 días" },
      { id: "c" as const, text: "En el hospital, el mismo día" },
      { id: "d" as const, text: "En el consulado, dentro de 15 días" },
    ],
  },
  // S2
  {
    text: "Acaba de llegar a Francia y empieza a trabajar. Su empleador le pregunta si tiene tarjeta Vitale. ¿Para qué sirve esta tarjeta?",
    explanation: "La tarjeta Vitale es la tarjeta del seguro de salud de la Seguridad Social. Permite el reembolso de los gastos médicos. Debe presentarse en el médico, la farmacia y el hospital para que los gastos sean cubiertos.",
    choices: [
      { id: "a" as const, text: "Es una tarjeta de transporte público" },
      { id: "b" as const, text: "Es una credencial profesional" },
      { id: "c" as const, text: "Es una tarjeta bancaria para funcionarios" },
      { id: "d" as const, text: "Es la tarjeta del seguro de salud que permite el reembolso de los gastos médicos" },
    ],
  },
  // S3
  {
    text: "Acaba de obtener la nacionalidad francesa y desea votar en las próximas elecciones. ¿Qué trámite debe realizar?",
    explanation: "Para votar en Francia hay que estar inscrito en las listas electorales del municipio. La inscripción puede hacerse en el ayuntamiento, en línea en service-public.fr o por correo. Los nuevos naturalizados suelen ser inscritos automáticamente, pero se recomienda verificar.",
    choices: [
      { id: "a" as const, text: "Ir a la prefectura el día de la votación" },
      { id: "b" as const, text: "Ningún trámite, los extranjeros en situación regular pueden votar" },
      { id: "c" as const, text: "Verificar su inscripción en las listas electorales en su ayuntamiento" },
      { id: "d" as const, text: "Solicitar una autorización especial al tribunal" },
    ],
  },
  // S4
  {
    text: "Su permiso de residencia vence en tres meses. ¿Qué debe hacer para renovarlo?",
    explanation: "La renovación del permiso de residencia debe solicitarse de 2 a 4 meses antes de su vencimiento, en la prefectura o subprefectura de su domicilio. La solicitud se realiza generalmente en línea en el sitio de ANEF.",
    choices: [
      { id: "a" as const, text: "Esperar a que el permiso venza para hacer la solicitud" },
      { id: "b" as const, text: "Contactar la embajada de Francia en su país de origen" },
      { id: "c" as const, text: "Pedir a su empleador que se encargue" },
      { id: "d" as const, text: "Solicitar la renovación en la prefectura antes del vencimiento" },
    ],
  },
  // S5
  {
    text: "Recibe un correo de la prefectura solicitándole documentos adicionales para su expediente. ¿Qué debe hacer?",
    explanation: "Cuando la prefectura solicita documentos complementarios, es imprescindible responder dentro de los plazos indicados. No responder puede provocar el rechazo de su solicitud. Si tiene dificultades, puede contactar a la prefectura o solicitar ayuda a una asociación.",
    choices: [
      { id: "a" as const, text: "Ignorar el correo, la prefectura se comunicará con usted después" },
      { id: "b" as const, text: "Presentar una denuncia porque la prefectura lo acosa" },
      { id: "c" as const, text: "Proporcionar los documentos solicitados dentro de los plazos indicados" },
      { id: "d" as const, text: "Esperar a tener un abogado para responder" },
    ],
  },
  // S6
  {
    text: "Acaba de mudarse a una nueva ciudad. ¿A qué organismos debe notificar su cambio de dirección?",
    explanation: "Al mudarse, debe notificar a numerosos organismos: la prefectura (si tiene permiso de residencia), la Seguridad Social (CPAM), la CAF, la administración fiscal, su banco y Correos. El sitio service-public.fr ofrece un servicio de cambio de dirección en línea.",
    choices: [
      { id: "a" as const, text: "Solo a Correos para el reenvío de correspondencia" },
      { id: "b" as const, text: "A ninguno, el cambio es automático" },
      { id: "c" as const, text: "Solo al ayuntamiento de su nueva ciudad" },
      { id: "d" as const, text: "La prefectura, la Seguridad Social, la CAF, los impuestos y su banco, entre otros" },
    ],
  },
  // S7
  {
    text: "Necesita realizar un trámite administrativo pero no sabe dónde informarse. Un amigo le recomienda un sitio oficial del gobierno. ¿Cuál?",
    explanation: "El sitio service-public.fr es el sitio oficial de la administración francesa. Reúne toda la información sobre trámites administrativos, derechos y obligaciones de los ciudadanos. También permite realizar algunos trámites en línea.",
    choices: [
      { id: "a" as const, text: "www.google.fr" },
      { id: "b" as const, text: "www.facebook.com" },
      { id: "c" as const, text: "www.service-public.fr" },
      { id: "d" as const, text: "www.wikipedia.org" },
    ],
  },
  // S8
  {
    text: "Desea casarse en Francia y el ayuntamiento le pide un acta de nacimiento de menos de 3 meses. Usted nació en el extranjero. ¿Dónde debe solicitar ese documento?",
    explanation: "Si nació en el extranjero y su nacimiento fue transcrito en los registros franceses, puede solicitar su acta de nacimiento al Servicio Central del Estado Civil en Nantes (SCEC). De lo contrario, deberá presentar el acta de nacimiento extranjera traducida y legalizada o apostillada.",
    choices: [
      { id: "a" as const, text: "En el ayuntamiento de su domicilio en Francia" },
      { id: "b" as const, text: "En la comisaría de policía" },
      { id: "c" as const, text: "En el tribunal de primera instancia" },
      { id: "d" as const, text: "En el Servicio Central del Estado Civil en Nantes o ante las autoridades de su país de origen" },
    ],
  },
  // S9
  {
    text: "Su vecino anciano se queja de fuertes dolores en el pecho y tiene dificultad para respirar. Usted cree que está sufriendo un infarto. ¿Qué número debe llamar de urgencia?",
    explanation: "El 15 es el número del SAMU (Servicio de Ayuda Médica Urgente). Debe llamarse ante cualquier emergencia médica grave: infarto, ACV, accidente grave. El SAMU envía un equipo médico al lugar y puede activar la intervención de los bomberos.",
    choices: [
      { id: "a" as const, text: "El 17 (policía)" },
      { id: "b" as const, text: "El 15 (SAMU)" },
      { id: "c" as const, text: "El 18 (bomberos)" },
      { id: "d" as const, text: "El 3114 (prevención del suicidio)" },
    ],
  },
  // S10
  {
    text: "Al regresar a casa por la noche, descubre que la puerta de su departamento fue forzada y que objetos desaparecieron. ¿Qué número debe llamar?",
    explanation: "El 17 es el número de la policía de socorro (o la gendarmería en zonas rurales). Debe llamarse en caso de delito en curso o reciente: robo, agresión, violencia. No toque nada en el lugar y espere la llegada de las fuerzas del orden.",
    choices: [
      { id: "a" as const, text: "El 15 (SAMU)" },
      { id: "b" as const, text: "El 17 (policía de socorro)" },
      { id: "c" as const, text: "El 18 (bomberos)" },
      { id: "d" as const, text: "El 12 (información telefónica)" },
    ],
  },
  // S11
  {
    text: "Percibe un fuerte olor a humo en su edificio y ve humo saliendo de un departamento vecino. ¿Qué número llama primero?",
    explanation: "El 18 es el número de los bomberos. Debe llamarse en caso de incendio, accidente de tránsito, inundación o cualquier situación que requiera socorro. En caso de duda, el 112 (número de emergencia europeo) también funciona.",
    choices: [
      { id: "a" as const, text: "El 18 (bomberos)" },
      { id: "b" as const, text: "El 15 (SAMU)" },
      { id: "c" as const, text: "El 17 (policía)" },
      { id: "d" as const, text: "La administración del edificio" },
    ],
  },
  // S12
  {
    text: "Es testigo de un accidente de tránsito en Francia pero no recuerda los números de emergencia franceses. ¿Qué número único puede llamar que funcione en toda Europa?",
    explanation: "El 112 es el número de emergencia europeo. Funciona en todos los países de la Unión Europea, gratuitamente y las 24 horas. Permite contactar a los servicios de socorro desde cualquier teléfono, incluso sin tarjeta SIM.",
    choices: [
      { id: "a" as const, text: "El 911" },
      { id: "b" as const, text: "El 112" },
      { id: "c" as const, text: "El 999" },
      { id: "d" as const, text: "El 114" },
    ],
  },
  // S13
  {
    text: "Se inscribe en la Seguridad Social y le piden que elija un médico de cabecera. ¿Por qué es importante?",
    explanation: "El médico de cabecera es el médico al que consulta primero por cualquier problema de salud. Coordina su recorrido de atención y lo deriva a especialistas si es necesario. Sin un médico de cabecera declarado, el reembolso de la Seguridad Social es menor.",
    choices: [
      { id: "a" as const, text: "Es obligatorio solo para los niños" },
      { id: "b" as const, text: "Es opcional y no tiene impacto en los reembolsos" },
      { id: "c" as const, text: "El médico de cabecera es únicamente un especialista" },
      { id: "d" as const, text: "El médico de cabecera coordina su atención y permite un mejor reembolso" },
    ],
  },
  // S14
  {
    text: "Su hijo se fractura el brazo al caer en un parque el domingo. Su médico de cabecera no trabaja los domingos. ¿Adónde debe llevarlo?",
    explanation: "En caso de emergencia médica cuando el médico de cabecera no está disponible, puede acudir a urgencias del hospital más cercano. En Francia, las urgencias hospitalarias funcionan las 24 horas, los 7 días de la semana. También puede llamar al 15 (SAMU) para obtener un consejo médico.",
    choices: [
      { id: "a" as const, text: "Esperar al lunes para ver al médico de cabecera" },
      { id: "b" as const, text: "Ir directamente a urgencias del hospital más cercano" },
      { id: "c" as const, text: "Llamar al ayuntamiento para obtener una cita" },
      { id: "d" as const, text: "Ir a la farmacia para pedir un yeso" },
    ],
  },
  // S15
  {
    text: "Son las 11 de la noche y necesita un medicamento urgente recetado por el médico. Todas las farmacias de su barrio están cerradas. ¿Qué puede hacer?",
    explanation: "En Francia, un sistema de farmacias de guardia asegura la dispensación de medicamentos por la noche, los domingos y días feriados. Para encontrar la farmacia de guardia más cercana, puede llamar al 3237 o consultar el sitio del Colegio de Farmacéuticos.",
    choices: [
      { id: "a" as const, text: "Esperar hasta la mañana siguiente" },
      { id: "b" as const, text: "Pedir el medicamento por Internet" },
      { id: "c" as const, text: "Buscar la farmacia de guardia llamando al 3237" },
      { id: "d" as const, text: "Ir a urgencias para obtener el medicamento" },
    ],
  },
  // S16
  {
    text: "Acaba de llegar a Francia con su hijo de 7 años. Desea inscribirlo en la escuela. ¿Adónde debe dirigirse primero?",
    explanation: "Para inscribir a un niño en la escuela primaria, primero debe acudir al ayuntamiento de su domicilio para obtener un certificado de inscripción, luego presentarse en la escuela con ese certificado. La escuela es obligatoria en Francia de 3 a 16 años, sin importar la nacionalidad del niño.",
    choices: [
      { id: "a" as const, text: "Al ayuntamiento de su domicilio para obtener un certificado de inscripción" },
      { id: "b" as const, text: "Directamente a la escuela más cercana" },
      { id: "c" as const, text: "A la prefectura para solicitar una autorización" },
      { id: "d" as const, text: "Al rectorado de la academia" },
    ],
  },
  // S17
  {
    text: "Su vecino le dice que su hijo de 4 años no necesita ir a la escuela porque es muy pequeño. ¿Tiene razón?",
    explanation: "No. Desde 2019, la instrucción es obligatoria en Francia desde los 3 años (y hasta los 16). Esto significa que todo niño residente en Francia, sin importar su nacionalidad, debe estar inscrito en un establecimiento escolar o recibir instrucción en casa.",
    choices: [
      { id: "a" as const, text: "Sí, la escuela solo es obligatoria a partir de los 6 años" },
      { id: "b" as const, text: "Sí, la escuela solo es obligatoria a partir de los 5 años" },
      { id: "c" as const, text: "No, la instrucción es obligatoria desde los 3 años en Francia" },
      { id: "d" as const, text: "No, la instrucción es obligatoria desde los 2 años en Francia" },
    ],
  },
  // S18
  {
    text: "Su hija de 14 años quiere usar un símbolo religioso visible en la escuela pública. El establecimiento le dice que no está permitido. ¿Es legal?",
    explanation: "Sí, es legal. La ley del 15 de marzo de 2004 prohíbe el uso de signos o prendas que manifiesten ostensiblemente una pertenencia religiosa en escuelas, colegios y liceos públicos. Esta ley se aplica a todas las religiones y busca preservar la laicidad en el espacio escolar.",
    choices: [
      { id: "a" as const, text: "No, es una discriminación religiosa" },
      { id: "b" as const, text: "Sí, la ley prohíbe los signos religiosos ostensibles en las escuelas públicas" },
      { id: "c" as const, text: "Depende de la religión en cuestión" },
      { id: "d" as const, text: "Solo concierne a los profesores, no a los alumnos" },
    ],
  },
  // S19
  {
    text: "La escuela de su hijo lo invita a una reunión de padres y profesores. No habla bien francés y duda en ir. ¿Qué debería hacer?",
    explanation: "Es importante asistir a las reuniones de padres y profesores para seguir la escolaridad de su hijo. Si no domina el francés, puede ir acompañado de alguien que traduzca o preguntar en la escuela si existe un servicio de interpretación.",
    choices: [
      { id: "a" as const, text: "No ir porque no entenderá nada" },
      { id: "b" as const, text: "Ir acompañado de una persona que pueda traducir" },
      { id: "c" as const, text: "Enviar una carta explicando que no puede asistir" },
      { id: "d" as const, text: "Esperar a que su hijo le transmita la información" },
    ],
  },
  // S20
  {
    text: "Su hijo regresa de la escuela llorando y le dice que compañeros lo golpean e insultan regularmente. ¿Qué debe hacer?",
    explanation: "El acoso escolar es un delito en Francia. Debe hablarlo con el director de la escuela o el jefe del establecimiento. También puede llamar al 3020 (número nacional contra el acoso escolar). La escuela tiene la obligación de proteger a los alumnos y tomar medidas.",
    choices: [
      { id: "a" as const, text: "Decirle a su hijo que se defienda solo" },
      { id: "b" as const, text: "Contactar a los padres de los niños involucrados para resolver el problema" },
      { id: "c" as const, text: "Reportar la situación al director de la escuela y llamar al 3020 si es necesario" },
      { id: "d" as const, text: "Cambiar a su hijo de escuela sin decir nada" },
    ],
  },
  // S21
  {
    text: "Desea inscribir a su hijo en el comedor escolar pero tiene ingresos modestos. ¿Cómo se calcula la tarifa?",
    explanation: "En la mayoría de los municipios, la tarifa del comedor escolar se calcula según los ingresos de la familia (cociente familiar). Las familias con menos ingresos pagan la tarifa más baja. Ningún niño puede ser excluido del comedor por razones económicas.",
    choices: [
      { id: "a" as const, text: "La tarifa es la misma para todos, sin excepción" },
      { id: "b" as const, text: "El comedor siempre es gratuito en Francia" },
      { id: "c" as const, text: "La tarifa se calcula según los ingresos de la familia" },
      { id: "d" as const, text: "Solo los niños de nacionalidad francesa pueden acceder" },
    ],
  },
  // S22
  {
    text: "Su hijo está enfermo y no puede ir a la escuela durante varios días. ¿Cuál es su obligación como padre?",
    explanation: "Los padres deben avisar a la escuela desde el primer día de ausencia y proporcionar un justificante (certificado médico, nota de excusa). Las ausencias injustificadas repetidas pueden derivar en una denuncia ante las autoridades, ya que la instrucción es obligatoria en Francia.",
    choices: [
      { id: "a" as const, text: "Nada, la escuela lo entenderá" },
      { id: "b" as const, text: "Avisar a la escuela desde el primer día y proporcionar un justificante" },
      { id: "c" as const, text: "Enviar un correo a la academia" },
      { id: "d" as const, text: "Esperar a que la escuela lo contacte" },
    ],
  },
  // S23
  {
    text: "Acaba de llegar a Francia y se pregunta si la inscripción de su hijo en la escuela pública tiene costo. ¿Cuál es la regla en Francia?",
    explanation: "La enseñanza en las escuelas públicas es gratuita en Francia, desde el preescolar hasta el liceo. Es un principio fundamental de la escuela republicana. Los libros de texto generalmente se proporcionan. Sin embargo, algunos útiles escolares quedan a cargo de las familias.",
    choices: [
      { id: "a" as const, text: "La escuela pública es gratuita para todos los niños que residen en Francia" },
      { id: "b" as const, text: "La escuela pública es de pago para las familias extranjeras" },
      { id: "c" as const, text: "La escuela es gratuita solo a partir del colegio" },
      { id: "d" as const, text: "Las tasas escolares dependen de la nacionalidad" },
    ],
  },
  // S24
  {
    text: "Acaba de perder su empleo en Francia. Un amigo le aconseja inscribirse en France Travail (antiguo Pôle emploi). ¿Por qué es importante?",
    explanation: "France Travail es el servicio público de empleo en Francia. La inscripción permite beneficiarse de acompañamiento en la búsqueda de empleo, formaciones y eventualmente una prestación por desempleo (ARE) si ha cotizado lo suficiente.",
    choices: [
      { id: "a" as const, text: "Es obligatorio solo para los ciudadanos franceses" },
      { id: "b" as const, text: "La inscripción permite recibir acompañamiento en la búsqueda de empleo y cobrar prestaciones por desempleo" },
      { id: "c" as const, text: "France Travail es una agencia de empleo temporal privada" },
      { id: "d" as const, text: "La inscripción solo es útil si busca empleo en la función pública" },
    ],
  },
  // S25
  {
    text: "Le ofrecen un empleo a tiempo completo pero el salario propuesto le parece muy bajo. ¿Existe un salario mínimo en Francia?",
    explanation: "Sí, el SMIC (Salario Mínimo Interprofesional de Crecimiento) es el salario mínimo por hora legal en Francia. Ningún asalariado mayor de edad puede cobrar por debajo del SMIC. Se revaloriza cada año. Puede verificar el monto actual en service-public.fr.",
    choices: [
      { id: "a" as const, text: "No, no existe salario mínimo en Francia" },
      { id: "b" as const, text: "El salario mínimo existe pero solo se aplica a los franceses" },
      { id: "c" as const, text: "Sí, el SMIC es el salario mínimo legal aplicable a todos los asalariados" },
      { id: "d" as const, text: "El salario mínimo lo fija cada empresa" },
    ],
  },
  // S26
  {
    text: "Comienza un nuevo empleo y su empleador le entrega un contrato de trabajo. ¿Qué elementos esenciales debe contener?",
    explanation: "Un contrato de trabajo debe contener como mínimo: la identidad de las partes, el puesto, la duración del trabajo, la remuneración, el lugar de trabajo, la fecha de inicio y el convenio colectivo aplicable. Para un CDD, la duración y el motivo deben especificarse.",
    choices: [
      { id: "a" as const, text: "Solo el salario y los horarios" },
      { id: "b" as const, text: "El contrato de trabajo no es obligatorio en Francia" },
      { id: "c" as const, text: "Solo el nombre de la empresa y su firma" },
      { id: "d" as const, text: "El puesto, la duración, el salario, el lugar de trabajo y el convenio colectivo, entre otros" },
    ],
  },
  // S27
  {
    text: "En el trabajo, su superior le niega un ascenso por su origen. ¿Qué puede hacer?",
    explanation: "La discriminación por origen está prohibida por la ley en Francia (Código del Trabajo y Código Penal). Puede recurrir al Defensor de los Derechos, presentar denuncia ante la policía o el fiscal, contactar a los representantes del personal o un sindicato, y acudir al consejo de trabajo.",
    choices: [
      { id: "a" as const, text: "Aceptar la situación porque el empleador siempre tiene razón" },
      { id: "b" as const, text: "Renunciar inmediatamente" },
      { id: "c" as const, text: "No hacer nada porque la ley no protege contra este tipo de discriminación" },
      { id: "d" as const, text: "Recurrir al Defensor de los Derechos, presentar denuncia o contactar un sindicato" },
    ],
  },
  // S28
  {
    text: "Trabaja desde hace un año en una empresa y desea tomar vacaciones. ¿Tiene derecho a vacaciones pagadas?",
    explanation: "En Francia, todo asalariado tiene derecho a 5 semanas de vacaciones pagadas al año (es decir, 2,5 días hábiles por mes trabajado). Este derecho está garantizado por el Código del Trabajo. El empleador no puede negar las vacaciones pagadas.",
    choices: [
      { id: "a" as const, text: "Sí, todo asalariado tiene derecho a 5 semanas de vacaciones pagadas al año" },
      { id: "b" as const, text: "No, las vacaciones pagadas solo se conceden después de 5 años de antigüedad" },
      { id: "c" as const, text: "Las vacaciones pagadas están reservadas a los ejecutivos" },
      { id: "d" as const, text: "Las vacaciones pagadas solo existen en la función pública" },
    ],
  },
  // S29
  {
    text: "Un compañero le habla de los sindicatos y le propone afiliarse. ¿Puede su empleador prohibirle afiliarse a un sindicato?",
    explanation: "No. La libertad sindical es un derecho fundamental inscrito en la Constitución francesa y en el Código del Trabajo. Todo asalariado es libre de afiliarse o no a un sindicato. El empleador no puede sancionar ni discriminar a un empleado por su pertenencia sindical.",
    choices: [
      { id: "a" as const, text: "Sí, el empleador puede prohibir toda actividad sindical" },
      { id: "b" as const, text: "Los sindicatos están reservados a los asalariados de nacionalidad francesa" },
      { id: "c" as const, text: "No, la libertad sindical es un derecho constitucional, el empleador no puede prohibirla" },
      { id: "d" as const, text: "Solo los funcionarios tienen derecho a afiliarse a un sindicato" },
    ],
  },
  // S30
  {
    text: "Compañeros le anuncian que van a hacer huelga para pedir un aumento de salario. Usted se pregunta si es legal en Francia. ¿Qué dice la ley?",
    explanation: "El derecho de huelga es un derecho constitucional en Francia, reconocido por el preámbulo de la Constitución de 1946. Todo asalariado puede participar en una huelga para defender sus intereses profesionales. El empleador no puede despedir a un empleado por haber hecho huelga.",
    choices: [
      { id: "a" as const, text: "La huelga es ilegal en Francia" },
      { id: "b" as const, text: "La huelga solo está autorizada en el sector público" },
      { id: "c" as const, text: "Solo los sindicatos pueden decidir una huelga" },
      { id: "d" as const, text: "El derecho de huelga es un derecho constitucional para todos los asalariados" },
    ],
  },
];

// ── Farsi (fa) ──────────────────────────────────────────────────────────────
export const sitTheme5Fa = [
  // S1
  {
    text: "همسرتان در بیمارستان زایمان کرده است. به شما گفته می‌شود که باید تولد را اعلام کنید. کجا و در چه مهلتی باید این کار را انجام دهید؟",
    explanation: "اعلام تولد باید در شهرداری محل تولد ظرف ۵ روز پس از زایمان انجام شود. این کار الزامی است و امکان صدور شناسنامه فرزند را فراهم می‌کند که برای تمام امور اداری ضروری است.",
    choices: [
      { id: "a" as const, text: "در شهرداری محل تولد، ظرف ۵ روز" },
      { id: "b" as const, text: "در استانداری، ظرف ۳۰ روز" },
      { id: "c" as const, text: "در بیمارستان، همان روز" },
      { id: "d" as const, text: "در کنسولگری، ظرف ۱۵ روز" },
    ],
  },
  // S2
  {
    text: "تازه به فرانسه آمده‌اید و شروع به کار کرده‌اید. کارفرما از شما می‌پرسد آیا کارت ویتال دارید. این کارت به چه کاری می‌آید؟",
    explanation: "کارت ویتال کارت بیمه درمانی تأمین اجتماعی است. امکان بازپرداخت هزینه‌های پزشکی را فراهم می‌کند. باید نزد پزشک، در داروخانه و بیمارستان ارائه شود تا هزینه‌ها تحت پوشش قرار گیرند.",
    choices: [
      { id: "a" as const, text: "یک کارت حمل‌ونقل عمومی است" },
      { id: "b" as const, text: "یک کارت شناسایی حرفه‌ای است" },
      { id: "c" as const, text: "یک کارت بانکی برای کارمندان دولت است" },
      { id: "d" as const, text: "کارت بیمه درمانی است که امکان بازپرداخت هزینه‌های درمان را می‌دهد" },
    ],
  },
  // S3
  {
    text: "تازه تابعیت فرانسه را دریافت کرده‌اید و می‌خواهید در انتخابات آینده رأی بدهید. چه اقدامی باید انجام دهید؟",
    explanation: "برای رأی دادن در فرانسه باید در فهرست انتخاباتی شهرداری خود ثبت‌نام کرده باشید. ثبت‌نام در شهرداری، به‌صورت آنلاین در service-public.fr یا از طریق پست امکان‌پذیر است. تابعیت‌یافتگان جدید معمولاً خودکار ثبت‌نام می‌شوند اما تأیید آن توصیه می‌شود.",
    choices: [
      { id: "a" as const, text: "در روز رأی‌گیری به استانداری بروید" },
      { id: "b" as const, text: "هیچ اقدامی لازم نیست، خارجیان دارای اقامت قانونی می‌توانند رأی بدهند" },
      { id: "c" as const, text: "ثبت‌نام خود در فهرست انتخاباتی را نزد شهرداری بررسی کنید" },
      { id: "d" as const, text: "مجوز ویژه از دادگاه بخواهید" },
    ],
  },
  // S4
  {
    text: "اجازه اقامت شما تا سه ماه دیگر منقضی می‌شود. برای تمدید آن چه باید بکنید؟",
    explanation: "درخواست تمدید اجازه اقامت باید ۲ تا ۴ ماه قبل از انقضا نزد استانداری یا فرمانداری محل سکونت انجام شود. درخواست معمولاً به‌صورت آنلاین در سایت ANEF انجام می‌شود.",
    choices: [
      { id: "a" as const, text: "صبر کنید تا اجازه اقامت منقضی شود و سپس درخواست دهید" },
      { id: "b" as const, text: "با سفارت فرانسه در کشور مبدأ تماس بگیرید" },
      { id: "c" as const, text: "از کارفرما بخواهید که رسیدگی کند" },
      { id: "d" as const, text: "درخواست تمدید را قبل از انقضا نزد استانداری ارائه دهید" },
    ],
  },
  // S5
  {
    text: "نامه‌ای از استانداری دریافت می‌کنید که از شما مدارک اضافی برای پرونده‌تان می‌خواهد. چه باید بکنید؟",
    explanation: "وقتی استانداری مدارک تکمیلی درخواست می‌کند، پاسخ دادن در مهلت‌های مشخص‌شده ضروری است. عدم پاسخ ممکن است منجر به رد درخواست شما شود. در صورت مشکل، می‌توانید با استانداری تماس بگیرید یا از یک انجمن کمک بخواهید.",
    choices: [
      { id: "a" as const, text: "نامه را نادیده بگیرید، استانداری دوباره با شما تماس خواهد گرفت" },
      { id: "b" as const, text: "شکایت کنید چون استانداری شما را اذیت می‌کند" },
      { id: "c" as const, text: "مدارک درخواست‌شده را در مهلت‌های مشخص ارائه دهید" },
      { id: "d" as const, text: "صبر کنید تا وکیل داشته باشید و سپس پاسخ دهید" },
    ],
  },
  // S6
  {
    text: "تازه به شهر جدیدی نقل مکان کرده‌اید. کدام سازمان‌ها را باید از تغییر آدرس خود مطلع کنید؟",
    explanation: "هنگام نقل مکان باید سازمان‌های متعددی را مطلع کنید: استانداری (اگر اجازه اقامت دارید)، تأمین اجتماعی، صندوق کمک خانواده، اداره مالیات، بانک و اداره پست. سایت service-public.fr خدمت تغییر آدرس آنلاین ارائه می‌دهد.",
    choices: [
      { id: "a" as const, text: "فقط اداره پست برای ارسال نامه‌ها" },
      { id: "b" as const, text: "هیچ سازمانی، تغییر خودکار است" },
      { id: "c" as const, text: "فقط شهرداری شهر جدید" },
      { id: "d" as const, text: "استانداری، تأمین اجتماعی، صندوق کمک خانواده، مالیات و بانک و غیره" },
    ],
  },
  // S7
  {
    text: "نیاز به انجام یک کار اداری دارید اما نمی‌دانید کجا اطلاعات بگیرید. دوستتان یک سایت رسمی دولتی توصیه می‌کند. کدام سایت؟",
    explanation: "سایت service-public.fr سایت رسمی اداری فرانسه است. تمام اطلاعات درباره امور اداری، حقوق و تعهدات شهروندان را گردآوری می‌کند. همچنین امکان انجام برخی امور اداری آنلاین را فراهم می‌کند.",
    choices: [
      { id: "a" as const, text: "www.google.fr" },
      { id: "b" as const, text: "www.facebook.com" },
      { id: "c" as const, text: "www.service-public.fr" },
      { id: "d" as const, text: "www.wikipedia.org" },
    ],
  },
  // S8
  {
    text: "می‌خواهید در فرانسه ازدواج کنید و شهرداری از شما شناسنامه کمتر از ۳ ماه می‌خواهد. شما در خارج متولد شده‌اید. این مدرک را از کجا باید درخواست کنید؟",
    explanation: "اگر در خارج متولد شده‌اید و تولد شما در دفاتر فرانسه ثبت شده، می‌توانید شناسنامه خود را از اداره مرکزی احوال شخصیه در نانت درخواست کنید. در غیر این صورت باید شناسنامه خارجی ترجمه و تأییدشده ارائه دهید.",
    choices: [
      { id: "a" as const, text: "در شهرداری محل سکونت در فرانسه" },
      { id: "b" as const, text: "در اداره پلیس" },
      { id: "c" as const, text: "در دادگاه بدوی" },
      { id: "d" as const, text: "در اداره مرکزی احوال شخصیه در نانت یا نزد مقامات کشور مبدأ" },
    ],
  },
  // S9
  {
    text: "همسایه مسن شما از درد شدید قفسه سینه شکایت دارد و نفس کشیدن برایش سخت است. فکر می‌کنید حمله قلبی کرده. با چه شماره‌ای فوری تماس می‌گیرید؟",
    explanation: "شماره ۱۵ شماره خدمات اورژانس پزشکی (SAMU) است. برای هر فوریت پزشکی جدی باید با آن تماس گرفت: حمله قلبی، سکته مغزی، حادثه شدید. SAMU تیم پزشکی اعزام می‌کند و می‌تواند آتش‌نشانی را فعال کند.",
    choices: [
      { id: "a" as const, text: "۱۷ (پلیس)" },
      { id: "b" as const, text: "۱۵ (SAMU)" },
      { id: "c" as const, text: "۱۸ (آتش‌نشانی)" },
      { id: "d" as const, text: "۳۱۱۴ (پیشگیری از خودکشی)" },
    ],
  },
  // S10
  {
    text: "هنگام بازگشت به خانه در شب، متوجه می‌شوید که در آپارتمان شما شکسته شده و اشیایی ناپدید شده‌اند. با چه شماره‌ای تماس می‌گیرید؟",
    explanation: "شماره ۱۷ شماره پلیس امداد (یا ژاندارمری در مناطق روستایی) است. در صورت جرم در حال وقوع یا اخیر باید با آن تماس گرفت: سرقت، حمله، خشونت. به هیچ چیز دست نزنید و منتظر رسیدن نیروهای انتظامی بمانید.",
    choices: [
      { id: "a" as const, text: "۱۵ (SAMU)" },
      { id: "b" as const, text: "۱۷ (پلیس امداد)" },
      { id: "c" as const, text: "۱۸ (آتش‌نشانی)" },
      { id: "d" as const, text: "۱۲ (اطلاعات تلفنی)" },
    ],
  },
  // S11
  {
    text: "بوی دود شدیدی در ساختمان احساس می‌کنید و دود از آپارتمان مجاور بیرون می‌آید. اولین شماره‌ای که تماس می‌گیرید چیست؟",
    explanation: "شماره ۱۸ شماره آتش‌نشانی است. در صورت آتش‌سوزی، تصادف جاده‌ای، سیل یا هر وضعیتی که نیاز به نجات دارد باید تماس گرفت. در صورت شک، شماره ۱۱۲ (شماره اورژانس اروپایی) نیز کار می‌کند.",
    choices: [
      { id: "a" as const, text: "۱۸ (آتش‌نشانی)" },
      { id: "b" as const, text: "۱۵ (SAMU)" },
      { id: "c" as const, text: "۱۷ (پلیس)" },
      { id: "d" as const, text: "مدیر ساختمان" },
    ],
  },
  // S12
  {
    text: "شاهد یک تصادف رانندگی در فرانسه هستید اما شماره‌های اورژانس فرانسه را به یاد نمی‌آورید. چه شماره واحدی می‌توانید بزنید که در سراسر اروپا کار می‌کند؟",
    explanation: "شماره ۱۱۲ شماره اورژانس اروپایی است. در تمام کشورهای اتحادیه اروپا، رایگان و ۲۴ ساعته کار می‌کند. از هر تلفنی حتی بدون سیم‌کارت می‌توان با خدمات امداد تماس گرفت.",
    choices: [
      { id: "a" as const, text: "۹۱۱" },
      { id: "b" as const, text: "۱۱۲" },
      { id: "c" as const, text: "۹۹۹" },
      { id: "d" as const, text: "۱۱۴" },
    ],
  },
  // S13
  {
    text: "در تأمین اجتماعی ثبت‌نام می‌کنید و از شما خواسته می‌شود پزشک خانواده انتخاب کنید. چرا این مهم است؟",
    explanation: "پزشک خانواده پزشکی است که برای هر مشکل سلامتی اول به او مراجعه می‌کنید. مسیر درمان شما را هماهنگ می‌کند و در صورت نیاز به متخصص ارجاع می‌دهد. بدون پزشک خانواده اعلام‌شده، بازپرداخت هزینه‌های تأمین اجتماعی کمتر است.",
    choices: [
      { id: "a" as const, text: "این فقط برای کودکان الزامی است" },
      { id: "b" as const, text: "اختیاری است و تأثیری بر بازپرداخت ندارد" },
      { id: "c" as const, text: "پزشک خانواده فقط یک متخصص است" },
      { id: "d" as const, text: "پزشک خانواده درمان شما را هماهنگ می‌کند و بازپرداخت بهتری را ممکن می‌سازد" },
    ],
  },
  // S14
  {
    text: "فرزندتان یکشنبه در پارک زمین می‌خورد و دستش می‌شکند. پزشک خانواده یکشنبه‌ها کار نمی‌کند. کجا باید ببریدش؟",
    explanation: "در فوریت پزشکی وقتی پزشک خانواده در دسترس نیست، می‌توانید به اورژانس نزدیک‌ترین بیمارستان بروید. در فرانسه اورژانس‌های بیمارستانی ۲۴ ساعته و ۷ روز هفته فعال هستند. همچنین می‌توانید با ۱۵ تماس بگیرید.",
    choices: [
      { id: "a" as const, text: "تا دوشنبه صبر کنید تا پزشک خانواده را ببینید" },
      { id: "b" as const, text: "مستقیماً به اورژانس نزدیک‌ترین بیمارستان بروید" },
      { id: "c" as const, text: "با شهرداری تماس بگیرید برای گرفتن وقت" },
      { id: "d" as const, text: "به داروخانه بروید و گچ بخواهید" },
    ],
  },
  // S15
  {
    text: "ساعت ۱۱ شب است و به دارویی فوری که پزشک تجویز کرده نیاز دارید. تمام داروخانه‌های محله بسته‌اند. چه می‌توانید بکنید؟",
    explanation: "در فرانسه سیستم داروخانه‌های کشیک شبانه، یکشنبه‌ها و تعطیلات رسمی دارو ارائه می‌دهد. برای یافتن نزدیک‌ترین داروخانه کشیک با شماره ۳۲۳۷ تماس بگیرید یا سایت نظام داروسازان را ببینید.",
    choices: [
      { id: "a" as const, text: "تا صبح فردا صبر کنید" },
      { id: "b" as const, text: "دارو را از اینترنت سفارش دهید" },
      { id: "c" as const, text: "داروخانه کشیک را با تماس با ۳۲۳۷ پیدا کنید" },
      { id: "d" as const, text: "به اورژانس بروید تا دارو بگیرید" },
    ],
  },
  // S16
  {
    text: "تازه با فرزند ۷ ساله‌تان به فرانسه آمده‌اید. می‌خواهید او را در مدرسه ثبت‌نام کنید. اول کجا باید بروید؟",
    explanation: "برای ثبت‌نام فرزند در دبستان، ابتدا باید به شهرداری محل سکونت بروید تا گواهی ثبت‌نام بگیرید، سپس با این گواهی به مدرسه مراجعه کنید. آموزش در فرانسه از ۳ تا ۱۶ سال الزامی است، صرف‌نظر از تابعیت فرزند.",
    choices: [
      { id: "a" as const, text: "به شهرداری محل سکونت برای دریافت گواهی ثبت‌نام" },
      { id: "b" as const, text: "مستقیماً به نزدیک‌ترین مدرسه" },
      { id: "c" as const, text: "به استانداری برای درخواست مجوز" },
      { id: "d" as const, text: "به ریاست آموزش و پرورش" },
    ],
  },
  // S17
  {
    text: "همسایه‌تان می‌گوید فرزند ۴ ساله‌اش نیازی به مدرسه رفتن ندارد چون خیلی کوچک است. آیا حق دارد؟",
    explanation: "خیر. از سال ۲۰۱۹ آموزش در فرانسه از ۳ سالگی الزامی است (تا ۱۶ سالگی). هر کودک مقیم فرانسه، صرف‌نظر از تابعیتش، باید در مدرسه ثبت‌نام شود یا آموزش خانگی دریافت کند.",
    choices: [
      { id: "a" as const, text: "بله، مدرسه فقط از ۶ سالگی الزامی است" },
      { id: "b" as const, text: "بله، مدرسه فقط از ۵ سالگی الزامی است" },
      { id: "c" as const, text: "خیر، آموزش از ۳ سالگی در فرانسه الزامی است" },
      { id: "d" as const, text: "خیر، آموزش از ۲ سالگی در فرانسه الزامی است" },
    ],
  },
  // S18
  {
    text: "دختر ۱۴ ساله‌تان می‌خواهد نماد مذهبی آشکاری در مدرسه دولتی بپوشد. مدرسه می‌گوید این مجاز نیست. آیا قانونی است؟",
    explanation: "بله، قانونی است. قانون ۱۵ مارس ۲۰۰۴ پوشیدن نمادها یا لباس‌هایی که آشکارا وابستگی مذهبی را نشان می‌دهند در مدارس دولتی را ممنوع کرده است. این قانون برای همه ادیان اعمال می‌شود و هدف حفظ لائیسیته در فضای مدرسه‌ای است.",
    choices: [
      { id: "a" as const, text: "خیر، این تبعیض مذهبی است" },
      { id: "b" as const, text: "بله، قانون نمادهای مذهبی آشکار را در مدارس دولتی ممنوع کرده است" },
      { id: "c" as const, text: "بستگی به دین مورد نظر دارد" },
      { id: "d" as const, text: "این فقط مربوط به معلمان است نه دانش‌آموزان" },
    ],
  },
  // S19
  {
    text: "مدرسه فرزندتان شما را به جلسه اولیا و مربیان دعوت کرده. فرانسوی خوب صحبت نمی‌کنید و مردد هستید. چه باید بکنید؟",
    explanation: "شرکت در جلسات اولیا و مربیان برای پیگیری تحصیل فرزندتان مهم است. اگر فرانسوی بلد نیستید، می‌توانید همراه کسی بروید که ترجمه کند یا از مدرسه بپرسید آیا خدمت ترجمه وجود دارد.",
    choices: [
      { id: "a" as const, text: "نروید چون چیزی نمی‌فهمید" },
      { id: "b" as const, text: "همراه کسی بروید که بتواند ترجمه کند" },
      { id: "c" as const, text: "نامه‌ای بفرستید و توضیح دهید نمی‌توانید بیایید" },
      { id: "d" as const, text: "صبر کنید تا فرزندتان اطلاعات را به شما منتقل کند" },
    ],
  },
  // S20
  {
    text: "فرزندتان گریان از مدرسه برمی‌گردد و می‌گوید هم‌کلاسی‌ها مرتباً او را می‌زنند و توهین می‌کنند. چه باید بکنید؟",
    explanation: "آزار مدرسه‌ای در فرانسه جرم است. باید با مدیر مدرسه صحبت کنید. همچنین می‌توانید با شماره ۳۰۲۰ تماس بگیرید. مدرسه موظف است از دانش‌آموزان محافظت کند و اقدام کند.",
    choices: [
      { id: "a" as const, text: "به فرزندتان بگویید خودش دفاع کند" },
      { id: "b" as const, text: "با والدین بچه‌های مقصر تماس بگیرید" },
      { id: "c" as const, text: "وضعیت را به مدیر مدرسه گزارش دهید و در صورت نیاز با ۳۰۲۰ تماس بگیرید" },
      { id: "d" as const, text: "فرزندتان را بدون گفتن چیزی به مدرسه دیگری ببرید" },
    ],
  },
  // S21
  {
    text: "می‌خواهید فرزندتان را در غذاخوری مدرسه ثبت‌نام کنید اما درآمد محدودی دارید. هزینه چگونه محاسبه می‌شود؟",
    explanation: "در اکثر شهرداری‌ها هزینه غذاخوری مدرسه بر اساس درآمد خانواده محاسبه می‌شود. خانواده‌های کم‌درآمد کمترین هزینه را می‌پردازند. هیچ کودکی به دلایل مالی از غذاخوری محروم نمی‌شود.",
    choices: [
      { id: "a" as const, text: "هزینه برای همه یکسان است بدون استثنا" },
      { id: "b" as const, text: "غذاخوری مدرسه همیشه رایگان است" },
      { id: "c" as const, text: "هزینه بر اساس درآمد خانواده محاسبه می‌شود" },
      { id: "d" as const, text: "فقط کودکان با تابعیت فرانسوی می‌توانند استفاده کنند" },
    ],
  },
  // S22
  {
    text: "فرزندتان مریض است و چند روز نمی‌تواند به مدرسه برود. وظیفه شما به عنوان ولی چیست؟",
    explanation: "والدین باید از روز اول غیبت مدرسه را مطلع کنند و مدرک ارائه دهند (گواهی پزشکی، نامه عذرخواهی). غیبت‌های بدون مدرک مکرر می‌تواند به اطلاع مقامات برسد چون آموزش در فرانسه الزامی است.",
    choices: [
      { id: "a" as const, text: "هیچ کاری، مدرسه درک خواهد کرد" },
      { id: "b" as const, text: "از روز اول مدرسه را مطلع کنید و مدرک ارائه دهید" },
      { id: "c" as const, text: "نامه‌ای به آموزش و پرورش بفرستید" },
      { id: "d" as const, text: "صبر کنید تا مدرسه با شما تماس بگیرد" },
    ],
  },
  // S23
  {
    text: "تازه به فرانسه آمده‌اید و می‌خواهید بدانید آیا ثبت‌نام فرزندتان در مدرسه دولتی هزینه دارد. قانون فرانسه چه می‌گوید؟",
    explanation: "آموزش در مدارس دولتی فرانسه از مهدکودک تا دبیرستان رایگان است. این یک اصل بنیادین مدرسه جمهوری است. کتاب‌های درسی معمولاً ارائه می‌شوند اما برخی لوازم مدرسه بر عهده خانواده‌هاست.",
    choices: [
      { id: "a" as const, text: "مدرسه دولتی برای همه کودکان مقیم فرانسه رایگان است" },
      { id: "b" as const, text: "مدرسه دولتی برای خانواده‌های خارجی پولی است" },
      { id: "c" as const, text: "مدرسه فقط از راهنمایی رایگان است" },
      { id: "d" as const, text: "شهریه به تابعیت بستگی دارد" },
    ],
  },
  // S24
  {
    text: "کارتان را در فرانسه از دست داده‌اید. دوستتان توصیه می‌کند در فرنس ترافای ثبت‌نام کنید. چرا مهم است؟",
    explanation: "فرنس ترافای سرویس دولتی اشتغال فرانسه است. ثبت‌نام امکان دریافت کمک در جستجوی کار، آموزش و احتمالاً کمک‌هزینه بیکاری را فراهم می‌کند.",
    choices: [
      { id: "a" as const, text: "این فقط برای شهروندان فرانسوی الزامی است" },
      { id: "b" as const, text: "ثبت‌نام امکان همراهی در جستجوی کار و دریافت کمک‌هزینه بیکاری را می‌دهد" },
      { id: "c" as const, text: "فرنس ترافای یک آژانس کاریابی خصوصی است" },
      { id: "d" as const, text: "ثبت‌نام فقط برای جستجوی شغل دولتی مفید است" },
    ],
  },
  // S25
  {
    text: "شغل تمام‌وقتی به شما پیشنهاد شده اما حقوق پیشنهادی خیلی کم به نظر می‌رسد. آیا حداقل دستمزد در فرانسه وجود دارد؟",
    explanation: "بله، SMIC حداقل دستمزد ساعتی قانونی در فرانسه است. هیچ کارمند بالغی نمی‌تواند کمتر از SMIC دریافت کند. هر سال بازبینی می‌شود. مبلغ فعلی را می‌توانید در service-public.fr بررسی کنید.",
    choices: [
      { id: "a" as const, text: "خیر، حداقل دستمزد در فرانسه وجود ندارد" },
      { id: "b" as const, text: "حداقل دستمزد وجود دارد اما فقط برای فرانسویان" },
      { id: "c" as const, text: "بله، SMIC حداقل دستمزد قانونی برای همه کارمندان است" },
      { id: "d" as const, text: "حداقل دستمزد توسط هر شرکت تعیین می‌شود" },
    ],
  },
  // S26
  {
    text: "کار جدیدی شروع می‌کنید و کارفرما قرارداد کار به شما می‌دهد. چه عناصر اساسی باید داشته باشد؟",
    explanation: "قرارداد کار حداقل باید شامل هویت طرفین، سمت، مدت کار، حقوق، محل کار، تاریخ شروع و توافقنامه جمعی باشد. برای قرارداد معین، مدت و دلیل نیز باید مشخص شود.",
    choices: [
      { id: "a" as const, text: "فقط حقوق و ساعات کار" },
      { id: "b" as const, text: "قرارداد کار در فرانسه الزامی نیست" },
      { id: "c" as const, text: "فقط نام شرکت و امضای شما" },
      { id: "d" as const, text: "سمت، مدت، حقوق، محل کار و توافقنامه جمعی و غیره" },
    ],
  },
  // S27
  {
    text: "در محل کار، مدیرتان به دلیل تبار شما از ارتقا امتناع می‌کند. چه می‌توانید بکنید؟",
    explanation: "تبعیض بر اساس تبار طبق قانون فرانسه ممنوع است. می‌توانید به مدافع حقوق مراجعه کنید، نزد پلیس یا دادستان شکایت کنید، با نمایندگان کارگری یا سندیکا تماس بگیرید.",
    choices: [
      { id: "a" as const, text: "وضعیت را بپذیرید چون کارفرما همیشه حق دارد" },
      { id: "b" as const, text: "فوراً استعفا دهید" },
      { id: "c" as const, text: "کاری نکنید چون قانون در برابر این نوع تبعیض حمایت نمی‌کند" },
      { id: "d" as const, text: "به مدافع حقوق مراجعه کنید، شکایت کنید یا با سندیکا تماس بگیرید" },
    ],
  },
  // S28
  {
    text: "یک سال است در شرکتی کار می‌کنید و می‌خواهید مرخصی بگیرید. آیا حق مرخصی با حقوق دارید؟",
    explanation: "در فرانسه هر کارمندی حق ۵ هفته مرخصی با حقوق در سال دارد (۲.۵ روز کاری در ماه). این حق طبق قانون کار تضمین شده است. کارفرما نمی‌تواند مرخصی با حقوق را رد کند.",
    choices: [
      { id: "a" as const, text: "بله، هر کارمندی حق ۵ هفته مرخصی با حقوق در سال دارد" },
      { id: "b" as const, text: "خیر، مرخصی با حقوق فقط پس از ۵ سال سابقه" },
      { id: "c" as const, text: "مرخصی با حقوق مخصوص مدیران است" },
      { id: "d" as const, text: "مرخصی با حقوق فقط در بخش دولتی وجود دارد" },
    ],
  },
  // S29
  {
    text: "همکاری درباره سندیکاها صحبت می‌کند و پیشنهاد عضویت می‌دهد. آیا کارفرما می‌تواند مانع عضویت شما در سندیکا شود؟",
    explanation: "خیر. آزادی سندیکایی حقی بنیادین است که در قانون اساسی فرانسه و قانون کار تضمین شده. هر کارمندی آزاد است عضو سندیکا بشود یا نشود. کارفرما نمی‌تواند به دلیل عضویت سندیکایی تنبیه یا تبعیض کند.",
    choices: [
      { id: "a" as const, text: "بله، کارفرما می‌تواند هر فعالیت سندیکایی را ممنوع کند" },
      { id: "b" as const, text: "سندیکاها مخصوص کارمندان با تابعیت فرانسوی هستند" },
      { id: "c" as const, text: "خیر، آزادی سندیکایی حق قانون اساسی است و کارفرما نمی‌تواند آن را ممنوع کند" },
      { id: "d" as const, text: "فقط کارمندان دولت حق عضویت در سندیکا دارند" },
    ],
  },
  // S30
  {
    text: "همکاران می‌گویند برای درخواست افزایش حقوق اعتصاب خواهند کرد. آیا این در فرانسه قانونی است؟ قانون چه می‌گوید؟",
    explanation: "حق اعتصاب یک حق قانون اساسی در فرانسه است که در مقدمه قانون اساسی ۱۹۴۶ به رسمیت شناخته شده. هر کارمندی می‌تواند برای دفاع از منافع حرفه‌ای خود در اعتصاب شرکت کند. کارفرما نمی‌تواند به دلیل اعتصاب اخراج کند.",
    choices: [
      { id: "a" as const, text: "اعتصاب در فرانسه غیرقانونی است" },
      { id: "b" as const, text: "اعتصاب فقط در بخش دولتی مجاز است" },
      { id: "c" as const, text: "فقط سندیکاها می‌توانند تصمیم به اعتصاب بگیرند" },
      { id: "d" as const, text: "حق اعتصاب یک حق قانون اساسی برای همه کارمندان است" },
    ],
  },
];

// ── Hindi (hi) ──────────────────────────────────────────────────────────────
export const sitTheme5Hi = [
  // S1
  {
    text: "आपकी पत्नी ने अस्पताल में शिशु को जन्म दिया है। आपको बताया गया है कि आपको जन्म की घोषणा करनी होगी। कहाँ और कितने समय में करनी होगी?",
    explanation: "जन्म की घोषणा जन्म स्थान की नगरपालिका में प्रसव के 5 दिनों के भीतर करनी होती है। यह अनिवार्य है और बच्चे का जन्म प्रमाणपत्र बनाने के लिए आवश्यक है, जो सभी प्रशासनिक कार्यों के लिए ज़रूरी है।",
    choices: [
      { id: "a" as const, text: "जन्म स्थान की नगरपालिका में, 5 दिनों के भीतर" },
      { id: "b" as const, text: "प्रीफ़ेक्चर में, 30 दिनों के भीतर" },
      { id: "c" as const, text: "अस्पताल में, उसी दिन" },
      { id: "d" as const, text: "वाणिज्य दूतावास में, 15 दिनों के भीतर" },
    ],
  },
  // S2
  {
    text: "आप अभी फ्रांस पहुँचे हैं और काम शुरू कर रहे हैं। आपका नियोक्ता पूछता है कि क्या आपके पास कार्ट विताल है। यह कार्ड किस काम का है?",
    explanation: "कार्ट विताल सामाजिक सुरक्षा का स्वास्थ्य बीमा कार्ड है। यह चिकित्सा खर्चों की प्रतिपूर्ति की अनुमति देता है। डॉक्टर, फार्मेसी और अस्पताल में इसे प्रस्तुत करना होता है ताकि खर्च कवर हो सकें।",
    choices: [
      { id: "a" as const, text: "यह सार्वजनिक परिवहन कार्ड है" },
      { id: "b" as const, text: "यह व्यावसायिक पहचान पत्र है" },
      { id: "c" as const, text: "यह सरकारी कर्मचारियों का बैंक कार्ड है" },
      { id: "d" as const, text: "यह स्वास्थ्य बीमा कार्ड है जो उपचार खर्चों की प्रतिपूर्ति की अनुमति देता है" },
    ],
  },
  // S3
  {
    text: "आपने अभी फ्रांसीसी नागरिकता प्राप्त की है और अगले चुनाव में मतदान करना चाहते हैं। आपको क्या करना होगा?",
    explanation: "फ्रांस में मतदान करने के लिए अपनी नगरपालिका की मतदाता सूची में पंजीकृत होना ज़रूरी है। पंजीकरण नगरपालिका में, service-public.fr पर ऑनलाइन या डाक से किया जा सकता है। नए नागरिक आमतौर पर स्वतः पंजीकृत होते हैं, लेकिन सत्यापन की सलाह दी जाती है।",
    choices: [
      { id: "a" as const, text: "मतदान के दिन प्रीफ़ेक्चर जाना" },
      { id: "b" as const, text: "कोई प्रक्रिया नहीं, नियमित निवासी विदेशी मतदान कर सकते हैं" },
      { id: "c" as const, text: "अपनी नगरपालिका में मतदाता सूची में अपना पंजीकरण सत्यापित करना" },
      { id: "d" as const, text: "न्यायालय से विशेष अनुमति माँगना" },
    ],
  },
  // S4
  {
    text: "आपके निवास परमिट की अवधि तीन महीने में समाप्त हो रही है। इसे नवीनीकृत करने के लिए क्या करना होगा?",
    explanation: "निवास परमिट का नवीनीकरण समाप्ति से 2 से 4 महीने पहले, आपके निवास स्थान के प्रीफ़ेक्चर या उप-प्रीफ़ेक्चर में अनुरोध करना होगा। आवेदन आमतौर पर ANEF की वेबसाइट पर ऑनलाइन किया जाता है।",
    choices: [
      { id: "a" as const, text: "परमिट समाप्त होने तक प्रतीक्षा करें फिर आवेदन करें" },
      { id: "b" as const, text: "अपने मूल देश में फ्रांसीसी दूतावास से संपर्क करें" },
      { id: "c" as const, text: "अपने नियोक्ता से कहें कि वह संभालें" },
      { id: "d" as const, text: "समाप्ति से पहले प्रीफ़ेक्चर में नवीनीकरण का आवेदन करें" },
    ],
  },
  // S5
  {
    text: "आपको प्रीफ़ेक्चर से एक पत्र मिलता है जिसमें आपकी फाइल के लिए अतिरिक्त दस्तावेज़ माँगे गए हैं। आपको क्या करना चाहिए?",
    explanation: "जब प्रीफ़ेक्चर पूरक दस्तावेज़ माँगता है, तो निर्धारित समय सीमा में जवाब देना अनिवार्य है। जवाब न देने पर आपका आवेदन अस्वीकार हो सकता है। कठिनाई होने पर, प्रीफ़ेक्चर से संपर्क करें या किसी संगठन से सहायता लें।",
    choices: [
      { id: "a" as const, text: "पत्र को अनदेखा करें, प्रीफ़ेक्चर फिर संपर्क करेगा" },
      { id: "b" as const, text: "शिकायत दर्ज करें क्योंकि प्रीफ़ेक्चर आपको परेशान कर रहा है" },
      { id: "c" as const, text: "निर्धारित समय सीमा में माँगे गए दस्तावेज़ प्रदान करें" },
      { id: "d" as const, text: "वकील मिलने तक प्रतीक्षा करें फिर जवाब दें" },
    ],
  },
  // S6
  {
    text: "आप अभी एक नए शहर में स्थानांतरित हुए हैं। किन संस्थाओं को अपने पते में बदलाव की सूचना देनी होगी?",
    explanation: "स्थानांतरण पर कई संस्थाओं को सूचित करना होगा: प्रीफ़ेक्चर (यदि निवास परमिट है), सामाजिक सुरक्षा, CAF, कर विभाग, बैंक और डाक विभाग। service-public.fr पर ऑनलाइन पता बदलने की सुविधा उपलब्ध है।",
    choices: [
      { id: "a" as const, text: "केवल डाक विभाग को पत्र अग्रेषण के लिए" },
      { id: "b" as const, text: "किसी को नहीं, बदलाव स्वतः हो जाता है" },
      { id: "c" as const, text: "केवल नए शहर की नगरपालिका को" },
      { id: "d" as const, text: "प्रीफ़ेक्चर, सामाजिक सुरक्षा, CAF, कर विभाग और बैंक आदि को" },
    ],
  },
  // S7
  {
    text: "आपको एक प्रशासनिक कार्य करना है लेकिन पता नहीं कहाँ जानकारी लें। एक दोस्त सरकारी आधिकारिक वेबसाइट की सलाह देता है। कौन सी?",
    explanation: "service-public.fr फ्रांसीसी प्रशासन की आधिकारिक वेबसाइट है। यह प्रशासनिक प्रक्रियाओं, अधिकारों और दायित्वों की सारी जानकारी एकत्र करती है। कुछ प्रक्रियाएँ ऑनलाइन भी की जा सकती हैं।",
    choices: [
      { id: "a" as const, text: "www.google.fr" },
      { id: "b" as const, text: "www.facebook.com" },
      { id: "c" as const, text: "www.service-public.fr" },
      { id: "d" as const, text: "www.wikipedia.org" },
    ],
  },
  // S8
  {
    text: "आप फ्रांस में विवाह करना चाहते हैं और नगरपालिका 3 महीने से कम पुराना जन्म प्रमाणपत्र माँगती है। आप विदेश में पैदा हुए हैं। यह दस्तावेज़ कहाँ से माँगना होगा?",
    explanation: "यदि आप विदेश में पैदा हुए हैं और आपका जन्म फ्रांसीसी रिकॉर्ड में दर्ज हुआ है, तो आप नांत में केंद्रीय नागरिक स्थिति सेवा से अपना जन्म प्रमाणपत्र माँग सकते हैं। अन्यथा, अनुवादित और प्रमाणित विदेशी जन्म प्रमाणपत्र प्रस्तुत करना होगा।",
    choices: [
      { id: "a" as const, text: "फ्रांस में अपने निवास स्थान की नगरपालिका में" },
      { id: "b" as const, text: "पुलिस प्रीफ़ेक्चर में" },
      { id: "c" as const, text: "उच्च न्यायालय में" },
      { id: "d" as const, text: "नांत की केंद्रीय नागरिक स्थिति सेवा में या अपने मूल देश के प्राधिकरणों से" },
    ],
  },
  // S9
  {
    text: "आपके बुजुर्ग पड़ोसी को सीने में तेज़ दर्द है और साँस लेने में कठिनाई हो रही है। आपको लगता है कि यह दिल का दौरा है। किस नंबर पर तुरंत कॉल करेंगे?",
    explanation: "15 SAMU (आपातकालीन चिकित्सा सहायता सेवा) का नंबर है। किसी भी गंभीर चिकित्सा आपातकाल में इसे कॉल करना चाहिए। SAMU मौके पर चिकित्सा दल भेजता है और दमकल को भी सक्रिय कर सकता है।",
    choices: [
      { id: "a" as const, text: "17 (पुलिस)" },
      { id: "b" as const, text: "15 (SAMU)" },
      { id: "c" as const, text: "18 (दमकल)" },
      { id: "d" as const, text: "3114 (आत्महत्या रोकथाम)" },
    ],
  },
  // S10
  {
    text: "शाम को घर लौटने पर आप पाते हैं कि आपके अपार्टमेंट का दरवाज़ा तोड़ा गया है और सामान गायब है। किस नंबर पर कॉल करेंगे?",
    explanation: "17 पुलिस सहायता (या ग्रामीण क्षेत्र में जेंडरमरी) का नंबर है। किसी चल रहे या हाल के अपराध में इसे कॉल करना चाहिए। कुछ भी न छुएँ और सुरक्षा बलों के आने तक प्रतीक्षा करें।",
    choices: [
      { id: "a" as const, text: "15 (SAMU)" },
      { id: "b" as const, text: "17 (पुलिस सहायता)" },
      { id: "c" as const, text: "18 (दमकल)" },
      { id: "d" as const, text: "12 (दूरभाष सूचना)" },
    ],
  },
  // S11
  {
    text: "आपकी इमारत में तेज़ धुएँ की गंध आ रही है और पड़ोसी अपार्टमेंट से धुआँ निकल रहा है। सबसे पहले किस नंबर पर कॉल करेंगे?",
    explanation: "18 दमकल का नंबर है। आग, सड़क दुर्घटना, बाढ़ या किसी बचाव स्थिति में कॉल करना चाहिए। संदेह होने पर 112 (यूरोपीय आपातकालीन नंबर) भी काम करता है।",
    choices: [
      { id: "a" as const, text: "18 (दमकल)" },
      { id: "b" as const, text: "15 (SAMU)" },
      { id: "c" as const, text: "17 (पुलिस)" },
      { id: "d" as const, text: "भवन प्रबंधक" },
    ],
  },
  // S12
  {
    text: "आप फ्रांस में एक सड़क दुर्घटना के गवाह हैं लेकिन फ्रांसीसी आपातकालीन नंबर याद नहीं हैं। कौन सा एकल नंबर पूरे यूरोप में काम करता है?",
    explanation: "112 यूरोपीय आपातकालीन नंबर है। यह यूरोपीय संघ के सभी देशों में मुफ्त और 24/7 काम करता है। किसी भी फोन से, बिना सिम कार्ड के भी बचाव सेवाओं से संपर्क किया जा सकता है।",
    choices: [
      { id: "a" as const, text: "911" },
      { id: "b" as const, text: "112" },
      { id: "c" as const, text: "999" },
      { id: "d" as const, text: "114" },
    ],
  },
  // S13
  {
    text: "आप सामाजिक सुरक्षा में पंजीकरण करा रहे हैं और आपसे पारिवारिक चिकित्सक चुनने को कहा जाता है। यह महत्वपूर्ण क्यों है?",
    explanation: "पारिवारिक चिकित्सक वह डॉक्टर है जिनसे आप किसी भी स्वास्थ्य समस्या के लिए पहले संपर्क करते हैं। वे आपकी उपचार यात्रा का समन्वय करते हैं और आवश्यकता पड़ने पर विशेषज्ञ के पास भेजते हैं। घोषित पारिवारिक चिकित्सक के बिना, सामाजिक सुरक्षा से प्रतिपूर्ति कम होती है।",
    choices: [
      { id: "a" as const, text: "यह केवल बच्चों के लिए अनिवार्य है" },
      { id: "b" as const, text: "यह वैकल्पिक है और प्रतिपूर्ति पर कोई प्रभाव नहीं" },
      { id: "c" as const, text: "पारिवारिक चिकित्सक केवल विशेषज्ञ होता है" },
      { id: "d" as const, text: "पारिवारिक चिकित्सक आपके उपचार का समन्वय करता है और बेहतर प्रतिपूर्ति सुनिश्चित करता है" },
    ],
  },
  // S14
  {
    text: "रविवार को पार्क में गिरने से आपके बच्चे का हाथ टूट गया। आपके पारिवारिक चिकित्सक रविवार को काम नहीं करते। उसे कहाँ ले जाना चाहिए?",
    explanation: "जब पारिवारिक चिकित्सक उपलब्ध न हो तो चिकित्सा आपातकाल में निकटतम अस्पताल के आपातकालीन विभाग में जा सकते हैं। फ्रांस में अस्पताल का आपातकालीन विभाग 24/7 काम करता है। चिकित्सा सलाह के लिए 15 पर भी कॉल कर सकते हैं।",
    choices: [
      { id: "a" as const, text: "सोमवार तक प्रतीक्षा करें और पारिवारिक चिकित्सक से मिलें" },
      { id: "b" as const, text: "सीधे निकटतम अस्पताल के आपातकालीन विभाग में जाएँ" },
      { id: "c" as const, text: "अपॉइंटमेंट के लिए नगरपालिका को कॉल करें" },
      { id: "d" as const, text: "प्लास्टर के लिए फार्मेसी जाएँ" },
    ],
  },
  // S15
  {
    text: "रात 11 बजे हैं और डॉक्टर द्वारा निर्धारित एक ज़रूरी दवा चाहिए। आपके मोहल्ले की सभी फार्मेसी बंद हैं। आप क्या कर सकते हैं?",
    explanation: "फ्रांस में ड्यूटी फार्मेसी की व्यवस्था रात, रविवार और सार्वजनिक अवकाश पर दवा प्रदान करती है। निकटतम ड्यूटी फार्मेसी जानने के लिए 3237 पर कॉल करें या फार्मासिस्ट कॉलेज की वेबसाइट देखें।",
    choices: [
      { id: "a" as const, text: "अगली सुबह तक प्रतीक्षा करें" },
      { id: "b" as const, text: "इंटरनेट से दवा ऑर्डर करें" },
      { id: "c" as const, text: "3237 पर कॉल करके ड्यूटी फार्मेसी खोजें" },
      { id: "d" as const, text: "दवा के लिए आपातकालीन विभाग जाएँ" },
    ],
  },
  // S16
  {
    text: "आप अभी अपने 7 साल के बच्चे के साथ फ्रांस आए हैं। उसे स्कूल में दाख़िल करना चाहते हैं। पहले कहाँ जाना होगा?",
    explanation: "प्राथमिक स्कूल में दाख़िले के लिए पहले अपने निवास स्थान की नगरपालिका में जाकर प्रवेश प्रमाणपत्र लेना होगा, फिर इस प्रमाणपत्र के साथ स्कूल में जाना होगा। फ्रांस में 3 से 16 वर्ष तक शिक्षा अनिवार्य है, राष्ट्रीयता कोई भी हो।",
    choices: [
      { id: "a" as const, text: "प्रवेश प्रमाणपत्र लेने के लिए अपने निवास स्थान की नगरपालिका में" },
      { id: "b" as const, text: "सीधे निकटतम स्कूल में" },
      { id: "c" as const, text: "अनुमति के लिए प्रीफ़ेक्चर में" },
      { id: "d" as const, text: "शिक्षा विभाग में" },
    ],
  },
  // S17
  {
    text: "आपका पड़ोसी कहता है कि उसके 4 साल के बच्चे को स्कूल जाने की ज़रूरत नहीं क्योंकि वह बहुत छोटा है। क्या वह सही है?",
    explanation: "नहीं। 2019 से फ्रांस में शिक्षा 3 वर्ष की आयु से अनिवार्य है (और 16 वर्ष तक)। फ्रांस में रहने वाला हर बच्चा, उसकी राष्ट्रीयता कोई भी हो, किसी शैक्षणिक संस्थान में पंजीकृत होना चाहिए या घर पर शिक्षा प्राप्त करनी चाहिए।",
    choices: [
      { id: "a" as const, text: "हाँ, स्कूल केवल 6 वर्ष से अनिवार्य है" },
      { id: "b" as const, text: "हाँ, स्कूल केवल 5 वर्ष से अनिवार्य है" },
      { id: "c" as const, text: "नहीं, फ्रांस में शिक्षा 3 वर्ष से अनिवार्य है" },
      { id: "d" as const, text: "नहीं, फ्रांस में शिक्षा 2 वर्ष से अनिवार्य है" },
    ],
  },
  // S18
  {
    text: "आपकी 14 वर्षीय बेटी सार्वजनिक स्कूल में एक दृश्य धार्मिक चिह्न पहनना चाहती है। स्कूल कहता है कि यह अनुमत नहीं है। क्या यह कानूनी है?",
    explanation: "हाँ, यह कानूनी है। 15 मार्च 2004 का कानून सार्वजनिक स्कूलों में स्पष्ट रूप से धार्मिक पहचान दर्शाने वाले चिह्नों या वस्त्रों को प्रतिबंधित करता है। यह कानून सभी धर्मों पर लागू होता है और शैक्षिक क्षेत्र में धर्मनिरपेक्षता बनाए रखने का लक्ष्य रखता है।",
    choices: [
      { id: "a" as const, text: "नहीं, यह धार्मिक भेदभाव है" },
      { id: "b" as const, text: "हाँ, कानून सार्वजनिक स्कूलों में स्पष्ट धार्मिक चिह्नों को प्रतिबंधित करता है" },
      { id: "c" as const, text: "यह धर्म पर निर्भर करता है" },
      { id: "d" as const, text: "यह केवल शिक्षकों पर लागू होता है, छात्रों पर नहीं" },
    ],
  },
  // S19
  {
    text: "आपके बच्चे का स्कूल आपको अभिभावक-शिक्षक बैठक में आमंत्रित करता है। आप फ्रेंच अच्छी तरह नहीं बोलते और जाने में हिचकिचा रहे हैं। आपको क्या करना चाहिए?",
    explanation: "बच्चे की पढ़ाई पर नज़र रखने के लिए अभिभावक-शिक्षक बैठकों में जाना महत्वपूर्ण है। यदि आप फ्रेंच नहीं जानते, तो अनुवाद कर सकने वाले व्यक्ति के साथ जाएँ, या स्कूल से पूछें कि क्या दुभाषिया सेवा उपलब्ध है।",
    choices: [
      { id: "a" as const, text: "न जाएँ क्योंकि कुछ समझ नहीं आएगा" },
      { id: "b" as const, text: "अनुवाद कर सकने वाले व्यक्ति के साथ जाएँ" },
      { id: "c" as const, text: "न आ सकने का कारण बताते हुए पत्र भेजें" },
      { id: "d" as const, text: "बच्चे से जानकारी मिलने तक प्रतीक्षा करें" },
    ],
  },
  // S20
  {
    text: "आपका बच्चा रोते हुए स्कूल से लौटता है और बताता है कि सहपाठी नियमित रूप से उसे मारते और गालियाँ देते हैं। आपको क्या करना चाहिए?",
    explanation: "स्कूली उत्पीड़न फ्रांस में अपराध है। आपको स्कूल के प्रधानाचार्य को बताना चाहिए। 3020 (स्कूली उत्पीड़न के खिलाफ राष्ट्रीय हेल्पलाइन) पर भी कॉल कर सकते हैं। स्कूल की छात्रों की सुरक्षा और कार्रवाई करने की बाध्यता है।",
    choices: [
      { id: "a" as const, text: "बच्चे से कहें कि अपनी रक्षा स्वयं करे" },
      { id: "b" as const, text: "संबंधित बच्चों के अभिभावकों से संपर्क करें" },
      { id: "c" as const, text: "स्थिति की रिपोर्ट स्कूल प्रधानाचार्य को करें और ज़रूरत पड़ने पर 3020 पर कॉल करें" },
      { id: "d" as const, text: "बिना कुछ बताए बच्चे को दूसरे स्कूल में भेज दें" },
    ],
  },
  // S21
  {
    text: "आप अपने बच्चे को स्कूल कैंटीन में दाख़िल करना चाहते हैं लेकिन आपकी आय सीमित है। शुल्क कैसे निर्धारित होता है?",
    explanation: "अधिकांश नगरपालिकाओं में कैंटीन का शुल्क परिवार की आय के आधार पर तय होता है। सबसे कम आय वाले परिवार सबसे कम भुगतान करते हैं। किसी भी बच्चे को आर्थिक कारणों से कैंटीन से वंचित नहीं किया जा सकता।",
    choices: [
      { id: "a" as const, text: "शुल्क सभी के लिए समान है, बिना अपवाद" },
      { id: "b" as const, text: "फ्रांस में कैंटीन हमेशा मुफ्त होती है" },
      { id: "c" as const, text: "शुल्क परिवार की आय के अनुसार तय होता है" },
      { id: "d" as const, text: "केवल फ्रांसीसी राष्ट्रीयता के बच्चे ही लाभ उठा सकते हैं" },
    ],
  },
  // S22
  {
    text: "आपका बच्चा बीमार है और कई दिन स्कूल नहीं जा सकता। अभिभावक के रूप में आपका दायित्व क्या है?",
    explanation: "अभिभावकों को पहले दिन से स्कूल को सूचित करना होगा और प्रमाण देना होगा (चिकित्सा प्रमाणपत्र, क्षमा-पत्र)। बार-बार बिना प्रमाण अनुपस्थिति पर अधिकारियों को सूचित किया जा सकता है, क्योंकि फ्रांस में शिक्षा अनिवार्य है।",
    choices: [
      { id: "a" as const, text: "कुछ नहीं, स्कूल समझ जाएगा" },
      { id: "b" as const, text: "पहले दिन से स्कूल को सूचित करें और प्रमाण दें" },
      { id: "c" as const, text: "शिक्षा विभाग को पत्र भेजें" },
      { id: "d" as const, text: "स्कूल द्वारा संपर्क करने तक प्रतीक्षा करें" },
    ],
  },
  // S23
  {
    text: "आप अभी फ्रांस पहुँचे हैं और जानना चाहते हैं कि क्या बच्चे को सरकारी स्कूल में दाख़िला सशुल्क है। फ्रांस में क्या नियम है?",
    explanation: "फ्रांस में सरकारी स्कूलों में शिक्षा नर्सरी से हाई स्कूल तक मुफ्त है। यह गणतांत्रिक स्कूल का मूल सिद्धांत है। पाठ्य पुस्तकें आमतौर पर प्रदान की जाती हैं। हालाँकि, कुछ स्कूल सामग्री का खर्च परिवारों को वहन करना होता है।",
    choices: [
      { id: "a" as const, text: "सरकारी स्कूल फ्रांस में रहने वाले सभी बच्चों के लिए मुफ्त है" },
      { id: "b" as const, text: "विदेशी परिवारों के लिए सरकारी स्कूल सशुल्क है" },
      { id: "c" as const, text: "स्कूल केवल माध्यमिक स्तर से मुफ्त है" },
      { id: "d" as const, text: "शुल्क राष्ट्रीयता पर निर्भर करता है" },
    ],
  },
  // S24
  {
    text: "आपने फ्रांस में अपनी नौकरी खो दी है। एक दोस्त फ्रांस ट्रावाय (पूर्व में पोल एम्प्लॉय) में पंजीकरण कराने की सलाह देता है। यह महत्वपूर्ण क्यों है?",
    explanation: "फ्रांस ट्रावाय फ्रांस की सार्वजनिक रोजगार सेवा है। पंजीकरण से नौकरी की तलाश में सहायता, प्रशिक्षण और यदि पर्याप्त योगदान हो तो बेरोजगारी भत्ता मिल सकता है।",
    choices: [
      { id: "a" as const, text: "यह केवल फ्रांसीसी नागरिकों के लिए अनिवार्य है" },
      { id: "b" as const, text: "पंजीकरण से नौकरी खोजने में सहायता और बेरोजगारी भत्ता मिल सकता है" },
      { id: "c" as const, text: "फ्रांस ट्रावाय एक निजी अस्थायी रोजगार एजेंसी है" },
      { id: "d" as const, text: "पंजीकरण केवल सरकारी नौकरी खोजने पर उपयोगी है" },
    ],
  },
  // S25
  {
    text: "आपको पूर्णकालिक नौकरी का प्रस्ताव मिला है लेकिन प्रस्तावित वेतन बहुत कम लगता है। क्या फ्रांस में न्यूनतम वेतन है?",
    explanation: "हाँ, SMIC फ्रांस में कानूनी न्यूनतम प्रति घंटा वेतन है। किसी भी वयस्क कर्मचारी को SMIC से कम भुगतान नहीं किया जा सकता। इसे हर साल संशोधित किया जाता है। वर्तमान राशि service-public.fr पर देख सकते हैं।",
    choices: [
      { id: "a" as const, text: "नहीं, फ्रांस में कोई न्यूनतम वेतन नहीं है" },
      { id: "b" as const, text: "न्यूनतम वेतन है लेकिन केवल फ्रांसीसियों पर लागू होता है" },
      { id: "c" as const, text: "हाँ, SMIC सभी कर्मचारियों पर लागू कानूनी न्यूनतम वेतन है" },
      { id: "d" as const, text: "न्यूनतम वेतन प्रत्येक कंपनी तय करती है" },
    ],
  },
  // S26
  {
    text: "आप नई नौकरी शुरू करते हैं और नियोक्ता आपको रोजगार अनुबंध देता है। इसमें कौन से आवश्यक तत्व होने चाहिए?",
    explanation: "रोजगार अनुबंध में कम से कम शामिल होना चाहिए: दोनों पक्षों की पहचान, पद, कार्य अवधि, वेतन, कार्यस्थल, प्रारंभ तिथि और लागू सामूहिक समझौता। निश्चित अवधि अनुबंध के लिए अवधि और कारण भी निर्दिष्ट होना चाहिए।",
    choices: [
      { id: "a" as const, text: "केवल वेतन और समय" },
      { id: "b" as const, text: "फ्रांस में रोजगार अनुबंध अनिवार्य नहीं है" },
      { id: "c" as const, text: "केवल कंपनी का नाम और आपका हस्ताक्षर" },
      { id: "d" as const, text: "पद, अवधि, वेतन, कार्यस्थल और सामूहिक समझौता आदि" },
    ],
  },
  // S27
  {
    text: "कार्यस्थल पर, आपका वरिष्ठ आपके मूल के कारण पदोन्नति देने से मना करता है। आप क्या कर सकते हैं?",
    explanation: "मूल के आधार पर भेदभाव फ्रांस में कानून द्वारा प्रतिबंधित है। आप अधिकार रक्षक से संपर्क कर सकते हैं, पुलिस या अभियोजक के पास शिकायत कर सकते हैं, कर्मचारी प्रतिनिधियों या यूनियन से संपर्क कर सकते हैं।",
    choices: [
      { id: "a" as const, text: "स्थिति स्वीकार करें क्योंकि नियोक्ता हमेशा सही होता है" },
      { id: "b" as const, text: "तुरंत इस्तीफा दें" },
      { id: "c" as const, text: "कुछ न करें क्योंकि कानून इस प्रकार के भेदभाव से सुरक्षा नहीं करता" },
      { id: "d" as const, text: "अधिकार रक्षक से संपर्क करें, शिकायत दर्ज करें या यूनियन से बात करें" },
    ],
  },
  // S28
  {
    text: "आप एक साल से कंपनी में काम कर रहे हैं और छुट्टी लेना चाहते हैं। क्या आपको सवेतन अवकाश का अधिकार है?",
    explanation: "फ्रांस में हर कर्मचारी को प्रति वर्ष 5 सप्ताह सवेतन अवकाश का अधिकार है (प्रति कार्य माह 2.5 कार्य दिवस)। यह अधिकार श्रम संहिता द्वारा गारंटीकृत है। नियोक्ता सवेतन अवकाश से इनकार नहीं कर सकता।",
    choices: [
      { id: "a" as const, text: "हाँ, हर कर्मचारी को प्रति वर्ष 5 सप्ताह सवेतन अवकाश का अधिकार है" },
      { id: "b" as const, text: "नहीं, सवेतन अवकाश केवल 5 वर्ष की सेवा के बाद मिलता है" },
      { id: "c" as const, text: "सवेतन अवकाश केवल वरिष्ठ अधिकारियों के लिए है" },
      { id: "d" as const, text: "सवेतन अवकाश केवल सरकारी क्षेत्र में है" },
    ],
  },
  // S29
  {
    text: "एक सहकर्मी यूनियन के बारे में बताता है और सदस्य बनने का प्रस्ताव देता है। क्या नियोक्ता आपको यूनियन में शामिल होने से रोक सकता है?",
    explanation: "नहीं। संघ की स्वतंत्रता फ्रांसीसी संविधान और श्रम संहिता में गारंटीकृत मौलिक अधिकार है। हर कर्मचारी यूनियन में शामिल होने या न होने के लिए स्वतंत्र है। नियोक्ता यूनियन सदस्यता के कारण दंडित या भेदभाव नहीं कर सकता।",
    choices: [
      { id: "a" as const, text: "हाँ, नियोक्ता सभी संघ गतिविधियों पर प्रतिबंध लगा सकता है" },
      { id: "b" as const, text: "यूनियन केवल फ्रांसीसी राष्ट्रीयता के कर्मचारियों के लिए हैं" },
      { id: "c" as const, text: "नहीं, संघ की स्वतंत्रता संवैधानिक अधिकार है, नियोक्ता इसे रोक नहीं सकता" },
      { id: "d" as const, text: "केवल सरकारी कर्मचारियों को यूनियन में शामिल होने का अधिकार है" },
    ],
  },
  // S30
  {
    text: "सहकर्मी बताते हैं कि वे वेतन वृद्धि की माँग के लिए हड़ताल करेंगे। आप सोच रहे हैं कि क्या यह फ्रांस में कानूनी है। कानून क्या कहता है?",
    explanation: "हड़ताल का अधिकार फ्रांस में संवैधानिक अधिकार है, जिसे 1946 के संविधान की प्रस्तावना में मान्यता दी गई है। हर कर्मचारी अपने व्यावसायिक हितों की रक्षा के लिए हड़ताल में भाग ले सकता है। नियोक्ता हड़ताल करने के कारण बर्खास्त नहीं कर सकता।",
    choices: [
      { id: "a" as const, text: "फ्रांस में हड़ताल अवैध है" },
      { id: "b" as const, text: "हड़ताल केवल सरकारी क्षेत्र में अनुमत है" },
      { id: "c" as const, text: "केवल यूनियन हड़ताल का निर्णय ले सकती हैं" },
      { id: "d" as const, text: "हड़ताल का अधिकार सभी कर्मचारियों का संवैधानिक अधिकार है" },
    ],
  },
];

// ── Portuguese (pt) ─────────────────────────────────────────────────────────
export const sitTheme5Pt = [
  // S1
  {
    text: "Sua esposa acabou de dar à luz no hospital. Informam que você deve declarar o nascimento. Onde e em que prazo deve fazer isso?",
    explanation: "A declaração de nascimento deve ser feita na prefeitura do local de nascimento dentro de 5 dias após o parto. É obrigatória e permite emitir a certidão de nascimento da criança, indispensável para todos os trâmites administrativos.",
    choices: [
      { id: "a" as const, text: "Na prefeitura do local de nascimento, dentro de 5 dias" },
      { id: "b" as const, text: "Na préfecture, dentro de 30 dias" },
      { id: "c" as const, text: "No hospital, no mesmo dia" },
      { id: "d" as const, text: "No consulado, dentro de 15 dias" },
    ],
  },
  // S2
  {
    text: "Você acabou de chegar à França e começa a trabalhar. Seu empregador pergunta se você tem a carte Vitale. Para que serve esse cartão?",
    explanation: "A carte Vitale é o cartão de seguro saúde da Seguridade Social. Permite o reembolso de despesas médicas. Deve ser apresentada no médico, na farmácia e no hospital para que as despesas sejam cobertas.",
    choices: [
      { id: "a" as const, text: "É um cartão de transporte público" },
      { id: "b" as const, text: "É uma carteira profissional" },
      { id: "c" as const, text: "É um cartão bancário para funcionários públicos" },
      { id: "d" as const, text: "É o cartão de seguro saúde que permite o reembolso de despesas médicas" },
    ],
  },
  // S3
  {
    text: "Você acabou de obter a nacionalidade francesa e deseja votar nas próximas eleições. Que procedimento deve realizar?",
    explanation: "Para votar na França, é preciso estar inscrito nas listas eleitorais do seu município. A inscrição pode ser feita na prefeitura, online no service-public.fr ou por correio. Os novos naturalizados geralmente são inscritos automaticamente, mas é aconselhável verificar.",
    choices: [
      { id: "a" as const, text: "Ir à préfecture no dia da votação" },
      { id: "b" as const, text: "Nenhum procedimento, estrangeiros em situação regular podem votar" },
      { id: "c" as const, text: "Verificar sua inscrição nas listas eleitorais junto à prefeitura" },
      { id: "d" as const, text: "Solicitar uma autorização especial ao tribunal" },
    ],
  },
  // S4
  {
    text: "Sua autorização de residência expira em três meses. O que deve fazer para renová-la?",
    explanation: "A renovação da autorização de residência deve ser solicitada 2 a 4 meses antes do vencimento, na préfecture ou sous-préfecture do seu domicílio. O pedido é feito geralmente online no site da ANEF.",
    choices: [
      { id: "a" as const, text: "Esperar que a autorização expire para fazer o pedido" },
      { id: "b" as const, text: "Contatar a embaixada da França no seu país de origem" },
      { id: "c" as const, text: "Pedir ao empregador que cuide disso" },
      { id: "d" as const, text: "Solicitar a renovação na préfecture antes do vencimento" },
    ],
  },
  // S5
  {
    text: "Você recebe uma correspondência da préfecture pedindo documentos adicionais para o seu dossiê. O que deve fazer?",
    explanation: "Quando a préfecture solicita documentos complementares, é imprescindível responder dentro dos prazos indicados. Não responder pode resultar na rejeição do seu pedido. Em caso de dificuldade, você pode contatar a préfecture ou pedir ajuda a uma associação.",
    choices: [
      { id: "a" as const, text: "Ignorar a correspondência, a préfecture entrará em contato novamente" },
      { id: "b" as const, text: "Registrar uma queixa porque a préfecture está assediando você" },
      { id: "c" as const, text: "Fornecer os documentos solicitados dentro dos prazos indicados" },
      { id: "d" as const, text: "Esperar ter um advogado para responder" },
    ],
  },
  // S6
  {
    text: "Você acabou de se mudar para uma nova cidade. Quais órgãos devem ser notificados sobre a mudança de endereço?",
    explanation: "Ao se mudar, é preciso notificar vários órgãos: a préfecture (se tiver autorização de residência), a Seguridade Social (CPAM), a CAF, a Receita Federal, seu banco e os Correios. O site service-public.fr oferece um serviço de mudança de endereço online.",
    choices: [
      { id: "a" as const, text: "Apenas os Correios para redirecionamento de correspondência" },
      { id: "b" as const, text: "Nenhum órgão, a mudança é automática" },
      { id: "c" as const, text: "Apenas a prefeitura da nova cidade" },
      { id: "d" as const, text: "A préfecture, a Seguridade Social, a CAF, a Receita Federal e seu banco, entre outros" },
    ],
  },
  // S7
  {
    text: "Você precisa fazer um trâmite administrativo mas não sabe onde se informar. Um amigo recomenda um site oficial do governo. Qual?",
    explanation: "O site service-public.fr é o site oficial da administração francesa. Reúne todas as informações sobre trâmites administrativos, direitos e obrigações dos cidadãos. Também permite realizar alguns trâmites online.",
    choices: [
      { id: "a" as const, text: "www.google.fr" },
      { id: "b" as const, text: "www.facebook.com" },
      { id: "c" as const, text: "www.service-public.fr" },
      { id: "d" as const, text: "www.wikipedia.org" },
    ],
  },
  // S8
  {
    text: "Você deseja se casar na França e a prefeitura pede uma certidão de nascimento com menos de 3 meses. Você nasceu no exterior. Onde deve solicitar esse documento?",
    explanation: "Se nasceu no exterior e seu nascimento foi transcrito nos registros franceses, pode solicitar sua certidão de nascimento ao Serviço Central do Estado Civil em Nantes (SCEC). Caso contrário, deverá apresentar a certidão de nascimento estrangeira traduzida e legalizada ou apostilada.",
    choices: [
      { id: "a" as const, text: "Na prefeitura do seu domicílio na França" },
      { id: "b" as const, text: "Na delegacia de polícia" },
      { id: "c" as const, text: "No tribunal de primeira instância" },
      { id: "d" as const, text: "No Serviço Central do Estado Civil em Nantes ou junto às autoridades do seu país de origem" },
    ],
  },
  // S9
  {
    text: "Seu vizinho idoso reclama de fortes dores no peito e tem dificuldade para respirar. Você acha que ele está tendo um infarto. Que número deve ligar com urgência?",
    explanation: "O 15 é o número do SAMU (Serviço de Ajuda Médica Urgente). Deve ser acionado em qualquer emergência médica grave: infarto, AVC, acidente grave. O SAMU envia uma equipe médica ao local e pode acionar os bombeiros.",
    choices: [
      { id: "a" as const, text: "O 17 (polícia)" },
      { id: "b" as const, text: "O 15 (SAMU)" },
      { id: "c" as const, text: "O 18 (bombeiros)" },
      { id: "d" as const, text: "O 3114 (prevenção ao suicídio)" },
    ],
  },
  // S10
  {
    text: "Ao voltar para casa à noite, descobre que a porta do seu apartamento foi arrombada e objetos desapareceram. Que número deve ligar?",
    explanation: "O 17 é o número da polícia de socorro (ou da gendarmaria em zona rural). Deve ser acionado em caso de infração em andamento ou recente: roubo, agressão, violência. Não toque em nada e aguarde a chegada das forças de segurança.",
    choices: [
      { id: "a" as const, text: "O 15 (SAMU)" },
      { id: "b" as const, text: "O 17 (polícia de socorro)" },
      { id: "c" as const, text: "O 18 (bombeiros)" },
      { id: "d" as const, text: "O 12 (informações telefônicas)" },
    ],
  },
  // S11
  {
    text: "Você sente um forte cheiro de fumaça no seu prédio e vê fumaça saindo de um apartamento vizinho. Que número liga primeiro?",
    explanation: "O 18 é o número dos bombeiros. Deve ser acionado em caso de incêndio, acidente de trânsito, inundação ou qualquer situação que necessite de socorro. Em caso de dúvida, o 112 (número de emergência europeu) também funciona.",
    choices: [
      { id: "a" as const, text: "O 18 (bombeiros)" },
      { id: "b" as const, text: "O 15 (SAMU)" },
      { id: "c" as const, text: "O 17 (polícia)" },
      { id: "d" as const, text: "O síndico do prédio" },
    ],
  },
  // S12
  {
    text: "Você testemunha um acidente de trânsito na França mas não se lembra dos números de emergência franceses. Que número único pode ligar que funciona em toda a Europa?",
    explanation: "O 112 é o número de emergência europeu. Funciona em todos os países da União Europeia, gratuitamente e 24 horas por dia. Permite contatar os serviços de socorro de qualquer telefone, mesmo sem chip.",
    choices: [
      { id: "a" as const, text: "O 911" },
      { id: "b" as const, text: "O 112" },
      { id: "c" as const, text: "O 999" },
      { id: "d" as const, text: "O 114" },
    ],
  },
  // S13
  {
    text: "Você se inscreve na Seguridade Social e pedem que escolha um médico de família. Por que isso é importante?",
    explanation: "O médico de família é o médico que você consulta primeiro para qualquer problema de saúde. Ele coordena seu percurso de cuidados e o encaminha a especialistas se necessário. Sem médico de família declarado, o reembolso da Seguridade Social é reduzido.",
    choices: [
      { id: "a" as const, text: "É obrigatório apenas para crianças" },
      { id: "b" as const, text: "É opcional e não impacta os reembolsos" },
      { id: "c" as const, text: "O médico de família é apenas um especialista" },
      { id: "d" as const, text: "O médico de família coordena seus cuidados e permite melhor reembolso" },
    ],
  },
  // S14
  {
    text: "Seu filho quebra o braço ao cair em um parque no domingo. Seu médico de família não trabalha aos domingos. Aonde deve levá-lo?",
    explanation: "Em caso de emergência médica quando o médico de família não está disponível, pode ir à emergência do hospital mais próximo. Na França, as emergências hospitalares funcionam 24 horas por dia, 7 dias por semana. Também pode ligar para o 15 (SAMU) para obter orientação médica.",
    choices: [
      { id: "a" as const, text: "Esperar até segunda-feira para ver o médico de família" },
      { id: "b" as const, text: "Ir diretamente à emergência do hospital mais próximo" },
      { id: "c" as const, text: "Ligar para a prefeitura para conseguir uma consulta" },
      { id: "d" as const, text: "Ir à farmácia para pedir um gesso" },
    ],
  },
  // S15
  {
    text: "São 23 horas e você precisa de um medicamento urgente prescrito pelo médico. Todas as farmácias do seu bairro estão fechadas. O que pode fazer?",
    explanation: "Na França, um sistema de farmácias de plantão garante a dispensação de medicamentos à noite, domingos e feriados. Para encontrar a farmácia de plantão mais próxima, pode ligar para o 3237 ou consultar o site da Ordem dos Farmacêuticos.",
    choices: [
      { id: "a" as const, text: "Esperar até a manhã seguinte" },
      { id: "b" as const, text: "Pedir o medicamento pela Internet" },
      { id: "c" as const, text: "Procurar a farmácia de plantão ligando para o 3237" },
      { id: "d" as const, text: "Ir à emergência para obter o medicamento" },
    ],
  },
  // S16
  {
    text: "Você acabou de chegar à França com seu filho de 7 anos. Deseja matriculá-lo na escola. Aonde deve ir primeiro?",
    explanation: "Para matricular uma criança na escola primária, primeiro deve ir à prefeitura do seu domicílio para obter um certificado de matrícula, depois ir à escola com esse certificado. A escola é obrigatória na França dos 3 aos 16 anos, independentemente da nacionalidade da criança.",
    choices: [
      { id: "a" as const, text: "À prefeitura do seu domicílio para obter um certificado de matrícula" },
      { id: "b" as const, text: "Diretamente à escola mais próxima" },
      { id: "c" as const, text: "À préfecture para solicitar uma autorização" },
      { id: "d" as const, text: "À reitoria da academia" },
    ],
  },
  // S17
  {
    text: "Seu vizinho diz que seu filho de 4 anos não precisa ir à escola porque é muito pequeno. Ele está certo?",
    explanation: "Não. Desde 2019, a instrução é obrigatória na França a partir dos 3 anos (e até os 16). Toda criança residente na França, independentemente da sua nacionalidade, deve estar matriculada em um estabelecimento escolar ou receber instrução em casa.",
    choices: [
      { id: "a" as const, text: "Sim, a escola só é obrigatória a partir dos 6 anos" },
      { id: "b" as const, text: "Sim, a escola só é obrigatória a partir dos 5 anos" },
      { id: "c" as const, text: "Não, a instrução é obrigatória a partir dos 3 anos na França" },
      { id: "d" as const, text: "Não, a instrução é obrigatória a partir dos 2 anos na França" },
    ],
  },
  // S18
  {
    text: "Sua filha de 14 anos quer usar um símbolo religioso visível na escola pública. A escola diz que não é permitido. Isso é legal?",
    explanation: "Sim, é legal. A lei de 15 de março de 2004 proíbe o uso de sinais ou roupas que manifestem ostensivamente uma pertença religiosa nas escolas públicas. Essa lei se aplica a todas as religiões e visa preservar a laicidade no espaço escolar.",
    choices: [
      { id: "a" as const, text: "Não, é discriminação religiosa" },
      { id: "b" as const, text: "Sim, a lei proíbe sinais religiosos ostensivos nas escolas públicas" },
      { id: "c" as const, text: "Depende da religião em questão" },
      { id: "d" as const, text: "Isso só se aplica aos professores, não aos alunos" },
    ],
  },
  // S19
  {
    text: "A escola do seu filho convida você para uma reunião de pais e professores. Você não fala bem francês e hesita em ir. O que deveria fazer?",
    explanation: "É importante comparecer às reuniões de pais e professores para acompanhar a escolaridade do seu filho. Se não domina o francês, pode ir acompanhado de alguém que traduza ou perguntar à escola se há serviço de interpretação.",
    choices: [
      { id: "a" as const, text: "Não ir porque não vai entender nada" },
      { id: "b" as const, text: "Ir acompanhado de alguém que possa traduzir" },
      { id: "c" as const, text: "Enviar uma carta explicando que não pode comparecer" },
      { id: "d" as const, text: "Esperar que seu filho transmita as informações" },
    ],
  },
  // S20
  {
    text: "Seu filho volta da escola chorando e diz que colegas o agridem e insultam regularmente. O que deve fazer?",
    explanation: "O bullying escolar é crime na França. Deve falar com o diretor da escola ou o responsável do estabelecimento. Também pode ligar para o 3020 (número nacional contra o bullying escolar). A escola tem a obrigação de proteger os alunos e tomar medidas.",
    choices: [
      { id: "a" as const, text: "Dizer ao seu filho que se defenda sozinho" },
      { id: "b" as const, text: "Contatar os pais das crianças envolvidas para resolver o problema" },
      { id: "c" as const, text: "Relatar a situação ao diretor da escola e ligar para o 3020 se necessário" },
      { id: "d" as const, text: "Mudar seu filho de escola sem dizer nada" },
    ],
  },
  // S21
  {
    text: "Deseja inscrever seu filho no refeitório escolar mas tem renda limitada. Como a tarifa é calculada?",
    explanation: "Na maioria dos municípios, a tarifa do refeitório escolar é calculada com base na renda da família (quociente familiar). As famílias com menor renda pagam a tarifa mais baixa. Nenhuma criança pode ser excluída do refeitório por motivos financeiros.",
    choices: [
      { id: "a" as const, text: "A tarifa é igual para todos, sem exceção" },
      { id: "b" as const, text: "O refeitório é sempre gratuito na França" },
      { id: "c" as const, text: "A tarifa é calculada de acordo com a renda da família" },
      { id: "d" as const, text: "Somente crianças de nacionalidade francesa podem acessar" },
    ],
  },
  // S22
  {
    text: "Seu filho está doente e não pode ir à escola durante vários dias. Qual é sua obrigação como responsável?",
    explanation: "Os pais devem avisar a escola desde o primeiro dia de ausência e fornecer um justificativo (atestado médico, bilhete de justificativa). Ausências injustificadas repetidas podem gerar uma notificação às autoridades, pois a instrução é obrigatória na França.",
    choices: [
      { id: "a" as const, text: "Nada, a escola vai entender" },
      { id: "b" as const, text: "Avisar a escola desde o primeiro dia e fornecer um justificativo" },
      { id: "c" as const, text: "Enviar uma carta à academia" },
      { id: "d" as const, text: "Esperar que a escola entre em contato" },
    ],
  },
  // S23
  {
    text: "Você acabou de chegar à França e se pergunta se a matrícula do seu filho na escola pública é paga. Qual é a regra na França?",
    explanation: "O ensino nas escolas públicas é gratuito na França, da educação infantil ao ensino médio. É um princípio fundamental da escola republicana. Os livros didáticos geralmente são fornecidos. No entanto, alguns materiais escolares ficam por conta das famílias.",
    choices: [
      { id: "a" as const, text: "A escola pública é gratuita para todas as crianças residentes na França" },
      { id: "b" as const, text: "A escola pública é paga para famílias estrangeiras" },
      { id: "c" as const, text: "A escola é gratuita apenas a partir do ensino fundamental II" },
      { id: "d" as const, text: "As taxas escolares dependem da nacionalidade" },
    ],
  },
  // S24
  {
    text: "Você acabou de perder o emprego na França. Um amigo aconselha se inscrever no France Travail (antigo Pôle emploi). Por que é importante?",
    explanation: "O France Travail é o serviço público de emprego na França. A inscrição permite receber acompanhamento na busca de emprego, formações e eventualmente o seguro-desemprego (ARE) se tiver contribuído o suficiente.",
    choices: [
      { id: "a" as const, text: "É obrigatório apenas para cidadãos franceses" },
      { id: "b" as const, text: "A inscrição permite receber acompanhamento na busca de emprego e seguro-desemprego" },
      { id: "c" as const, text: "O France Travail é uma agência de emprego temporário privada" },
      { id: "d" as const, text: "A inscrição só é útil para buscar emprego no serviço público" },
    ],
  },
  // S25
  {
    text: "Oferecem-lhe um emprego em tempo integral, mas o salário proposto parece muito baixo. Existe um salário mínimo na França?",
    explanation: "Sim, o SMIC (Salário Mínimo Interprofissional de Crescimento) é o salário mínimo por hora legal na França. Nenhum empregado maior de idade pode receber abaixo do SMIC. Ele é reajustado todo ano. Você pode verificar o valor atual no service-public.fr.",
    choices: [
      { id: "a" as const, text: "Não, não existe salário mínimo na França" },
      { id: "b" as const, text: "O salário mínimo existe mas só se aplica aos franceses" },
      { id: "c" as const, text: "Sim, o SMIC é o salário mínimo legal aplicável a todos os empregados" },
      { id: "d" as const, text: "O salário mínimo é definido por cada empresa" },
    ],
  },
  // S26
  {
    text: "Você começa um novo emprego e seu empregador entrega um contrato de trabalho. Que elementos essenciais ele deve conter?",
    explanation: "Um contrato de trabalho deve conter no mínimo: a identidade das partes, o cargo, a duração do trabalho, a remuneração, o local de trabalho, a data de início e a convenção coletiva aplicável. Para um CDD, a duração e o motivo também devem ser especificados.",
    choices: [
      { id: "a" as const, text: "Apenas o salário e os horários" },
      { id: "b" as const, text: "O contrato de trabalho não é obrigatório na França" },
      { id: "c" as const, text: "Apenas o nome da empresa e sua assinatura" },
      { id: "d" as const, text: "O cargo, a duração, o salário, o local de trabalho e a convenção coletiva, entre outros" },
    ],
  },
  // S27
  {
    text: "No trabalho, seu superior recusa uma promoção por causa da sua origem. O que pode fazer?",
    explanation: "A discriminação por origem é proibida por lei na França (Código do Trabalho e Código Penal). Pode recorrer ao Defensor dos Direitos, registrar queixa na polícia ou no Ministério Público, contatar representantes dos trabalhadores ou um sindicato.",
    choices: [
      { id: "a" as const, text: "Aceitar a situação porque o empregador sempre tem razão" },
      { id: "b" as const, text: "Pedir demissão imediatamente" },
      { id: "c" as const, text: "Não fazer nada porque a lei não protege contra esse tipo de discriminação" },
      { id: "d" as const, text: "Recorrer ao Defensor dos Direitos, registrar queixa ou contatar um sindicato" },
    ],
  },
  // S28
  {
    text: "Trabalha há um ano em uma empresa e deseja tirar férias. Tem direito a férias remuneradas?",
    explanation: "Na França, todo empregado tem direito a 5 semanas de férias remuneradas por ano (ou seja, 2,5 dias úteis por mês trabalhado). Esse direito é garantido pelo Código do Trabalho. O empregador não pode recusar as férias remuneradas.",
    choices: [
      { id: "a" as const, text: "Sim, todo empregado tem direito a 5 semanas de férias remuneradas por ano" },
      { id: "b" as const, text: "Não, férias remuneradas só são concedidas após 5 anos de antiguidade" },
      { id: "c" as const, text: "Férias remuneradas são reservadas aos executivos" },
      { id: "d" as const, text: "Férias remuneradas só existem no serviço público" },
    ],
  },
  // S29
  {
    text: "Um colega fala sobre sindicatos e propõe que você se filie. Seu empregador pode proibi-lo de se filiar a um sindicato?",
    explanation: "Não. A liberdade sindical é um direito fundamental inscrito na Constituição francesa e no Código do Trabalho. Todo empregado é livre para se filiar ou não a um sindicato. O empregador não pode punir ou discriminar um empregado por sua filiação sindical.",
    choices: [
      { id: "a" as const, text: "Sim, o empregador pode proibir qualquer atividade sindical" },
      { id: "b" as const, text: "Os sindicatos são reservados a empregados de nacionalidade francesa" },
      { id: "c" as const, text: "Não, a liberdade sindical é um direito constitucional, o empregador não pode proibi-la" },
      { id: "d" as const, text: "Somente funcionários públicos têm direito a se filiar a um sindicato" },
    ],
  },
  // S30
  {
    text: "Colegas anunciam que farão greve para pedir aumento salarial. Você se pergunta se é legal na França. O que diz a lei?",
    explanation: "O direito de greve é um direito constitucional na França, reconhecido pelo preâmbulo da Constituição de 1946. Todo empregado pode participar de uma greve para defender seus interesses profissionais. O empregador não pode demitir um empregado por ter feito greve.",
    choices: [
      { id: "a" as const, text: "A greve é ilegal na França" },
      { id: "b" as const, text: "A greve só é autorizada no setor público" },
      { id: "c" as const, text: "Somente os sindicatos podem decidir uma greve" },
      { id: "d" as const, text: "O direito de greve é um direito constitucional para todos os empregados" },
    ],
  },
];
