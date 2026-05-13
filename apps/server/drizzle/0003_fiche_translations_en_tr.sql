-- Hard-coded EN + TR translations for the 5 study fiches.
--
-- These translations are produced by Claude (Anthropic) during a single
-- session, then checked into git so the prod content is fully reproducible
-- without any external API at runtime. Markdown structure is preserved
-- (headings, list markers, bold) — only prose translated. Institutional
-- names kept in French with an English/Turkish gloss on first mention.
--
-- Idempotent: ON CONFLICT (fiche_id, lang) DO NOTHING — re-running this
-- file is safe and never overwrites an existing row.

INSERT INTO fiche_translations (fiche_id, lang, title, content) VALUES
(1, 'en', 'The principles and values of the French Republic',
$content$# The principles and values of the French Republic

## The motto: Liberty, Equality, Fraternity

The motto of the French Republic is enshrined in the Constitution. It sums up the fundamental values of the nation.

- **Liberty**: every citizen is free in their opinions, religion, and movement.
- **Equality**: all citizens are equal before the law, without distinction of origin, race or religion.
- **Fraternity**: citizens must show solidarity towards one another.

## Laïcité (French secularism)

The law of 9 December 1905 established the separation of Churches and the State. *Laïcité* (French secularism) guarantees freedom of conscience: everyone is free to believe or not to believe. The State favors no religion.

## The symbols of the Republic

- The **tricolour flag** (blue, white, red)
- The **national anthem**: the Marseillaise
- **Marianne**: the female figure who represents the Republic
- The **motto**: Liberty, Equality, Fraternity

## Democracy

France is a democratic republic. Power belongs to the people, who exercise it through voting. Suffrage is universal: every adult citizen may vote.$content$),

(1, 'tr', 'Fransa Cumhuriyeti''nin ilkeleri ve değerleri',
$content$# Fransa Cumhuriyeti'nin ilkeleri ve değerleri

## Slogan: Özgürlük, Eşitlik, Kardeşlik

Fransa Cumhuriyeti'nin sloganı Anayasa'da yer alır. Ulusun temel değerlerini özetler.

- **Özgürlük (Liberté)**: her vatandaş düşüncelerinde, dininde ve hareketinde özgürdür.
- **Eşitlik (Égalité)**: tüm vatandaşlar köken, ırk veya din ayrımı yapılmaksızın yasa önünde eşittir.
- **Kardeşlik (Fraternité)**: vatandaşlar birbirlerine karşı dayanışma göstermelidir.

## Laïcité (Fransız laikliği)

9 Aralık 1905 tarihli yasa, Kiliseler ile Devlet'in ayrılığını kurmuştur. *Laïcité* (Fransız laikliği) vicdan özgürlüğünü güvence altına alır: herkes inanmakta veya inanmamakta özgürdür. Devlet hiçbir dine ayrıcalık tanımaz.

## Cumhuriyet'in sembolleri

- **Üç renkli bayrak** (mavi, beyaz, kırmızı)
- **Ulusal marş**: Marseillaise
- **Marianne**: Cumhuriyet'i temsil eden kadın figürü
- **Slogan**: Özgürlük, Eşitlik, Kardeşlik

## Demokrasi

Fransa demokratik bir cumhuriyettir. Güç halka aittir ve halk bunu oylama yoluyla kullanır. Seçme hakkı geneldir: reşit olan her vatandaş oy kullanabilir.$content$),

(2, 'en', 'The French institutional and political system',
$content$# The French institutional and political system

## The Constitution of 1958

The Fifth Republic was founded by the Constitution of 4 October 1958. It organises the powers of the State.

## The President of the Republic

- Head of State, elected by direct universal suffrage for 5 years (*quinquennat*)
- Appoints the Prime Minister
- May dissolve the National Assembly
- Commander-in-chief of the armed forces

## The Government

- Headed by the Prime Minister
- Directs the policy of the nation
- Accountable to the National Assembly

## The Parliament

Parliament passes the laws. It is made up of two chambers:
- The **National Assembly** (*Assemblée nationale*): 577 deputies elected by direct universal suffrage for 5 years
- The **Senate** (*Sénat*): 348 senators elected by indirect universal suffrage for 6 years

## Local authorities

- **Communes**: more than 35,000, headed by a mayor (*maire*) and a municipal council
- **Departments** (*départements*): 101 (96 in mainland France + 5 overseas)
- **Regions** (*régions*): 18 (13 in mainland France + 5 overseas)$content$),

(2, 'tr', 'Fransız kurumsal ve siyasi sistemi',
$content$# Fransız kurumsal ve siyasi sistemi

## 1958 Anayasası

V. Cumhuriyet, 4 Ekim 1958 tarihli Anayasa ile kurulmuştur. Devletin yetkilerini düzenler.

## Cumhuriyet Cumhurbaşkanı

- Devlet başkanı, 5 yıllığına doğrudan genel oyla seçilir (*quinquennat*)
- Başbakanı atar
- Ulusal Meclis'i feshedebilir
- Silahlı kuvvetlerin başkomutanıdır

## Hükümet

- Başbakan tarafından yönetilir
- Ulusun politikasını yürütür
- Ulusal Meclis'e karşı sorumludur

## Parlamento

Parlamento yasaları oylar. İki meclisten oluşur:
- **Ulusal Meclis** (*Assemblée nationale*): 5 yıllığına doğrudan genel oyla seçilen 577 milletvekili
- **Senato** (*Sénat*): 6 yıllığına dolaylı genel oyla seçilen 348 senatör

## Yerel yönetimler

- **Komünler** (*communes*): 35.000'den fazla, bir belediye başkanı (*maire*) ve belediye meclisi tarafından yönetilir
- **Departmanlar** (*départements*): 101 (96 anakara + 5 deniz aşırı)
- **Bölgeler** (*régions*): 18 (13 anakara + 5 deniz aşırı)$content$),

(3, 'en', 'The rights and duties of the citizen',
$content$# The rights and duties of the citizen

## Fundamental rights

The Declaration of the Rights of Man and of the Citizen (1789) and the Constitution guarantee:

- **Freedom of expression**: everyone may express their opinions (within the limits of the law)
- **Freedom of conscience and religion**: everyone is free in their beliefs
- **Right to vote**: every adult citizen (18 and over) may vote
- **Equality before the law**: without distinction of origin, sex or religion
- **Right to education**: schooling is compulsory from age 3 to 16
- **Right of asylum**: protection for people who are persecuted
- **Presumption of innocence**: every person is innocent until proven guilty

## Duties

- **Obey the laws** of the Republic
- **Pay taxes**: they fund public services
- **Take part in national defence**: Defence and Citizenship Day (*Journée défense et citoyenneté*, JDC)
- **Vote**: a moral duty (not legally required)
- **Respect the rights of others**
- **Send your children to school**

## Equality between women and men

Equality between women and men is a constitutional principle. Women obtained the right to vote in 1944.$content$),

(3, 'tr', 'Vatandaşın hak ve görevleri',
$content$# Vatandaşın hak ve görevleri

## Temel haklar

İnsan ve Vatandaş Hakları Bildirgesi (1789) ve Anayasa şunları güvence altına alır:

- **İfade özgürlüğü**: herkes düşüncelerini ifade edebilir (yasanın sınırları içinde)
- **Vicdan ve din özgürlüğü**: herkes inançlarında özgürdür
- **Oy kullanma hakkı**: 18 yaşını doldurmuş her vatandaş oy kullanabilir
- **Yasa önünde eşitlik**: köken, cinsiyet veya din ayrımı yapılmaksızın
- **Eğitim hakkı**: 3 ile 16 yaş arasında okula gitmek zorunludur
- **Sığınma hakkı**: zulme uğrayan kişilerin korunması
- **Masumiyet karinesi**: suçu kanıtlanana kadar herkes masumdur

## Görevler

- Cumhuriyet'in **yasalarına uymak**
- **Vergi ödemek**: kamu hizmetlerini finanse eder
- **Ulusal savunmaya katılmak**: Savunma ve Vatandaşlık Günü (*Journée défense et citoyenneté*, JDC)
- **Oy kullanmak**: ahlaki bir görev (yasal olarak zorunlu değil)
- **Başkalarının haklarına saygı göstermek**
- **Çocuklarını okula göndermek**

## Kadın-erkek eşitliği

Kadın ile erkek arasındaki eşitlik anayasal bir ilkedir. Kadınlar oy kullanma hakkını 1944'te elde etmiştir.$content$),

(4, 'en', 'History, geography and culture of France',
$content$# History, geography and culture of France

## Key dates in history

- **1789**: French Revolution, storming of the Bastille (14 July), Declaration of the Rights of Man and of the Citizen
- **1848**: Definitive abolition of slavery (Victor Schœlcher)
- **1905**: Law of separation of Churches and the State
- **1944**: Right to vote for women
- **1945**: End of the Second World War (8 May)
- **1958**: Foundation of the Fifth Republic (Constitution of 4 October)

## Public holidays and commemorations

- **14 July**: National Day (storming of the Bastille)
- **11 November**: 1918 Armistice (end of the First World War)
- **8 May**: 1945 Victory Day (end of the Second World War in Europe)

## Geography

- **Capital**: Paris
- **Population**: about 68 million inhabitants
- **13 mainland regions** and 5 overseas regions
- France is the largest country in the European Union by area

## The Enlightenment (*les Lumières*)

An intellectual movement of the 18th century carrying the ideas of reason, liberty and progress. Main figures: Voltaire, Rousseau, Montesquieu, Diderot.$content$),

(4, 'tr', 'Fransa''nın tarihi, coğrafyası ve kültürü',
$content$# Fransa'nın tarihi, coğrafyası ve kültürü

## Tarihin önemli tarihleri

- **1789**: Fransız Devrimi, Bastille'in ele geçirilmesi (14 Temmuz), İnsan ve Vatandaş Hakları Bildirgesi
- **1848**: Köleliğin kesin olarak kaldırılması (Victor Schœlcher)
- **1905**: Kiliseler ile Devlet'in ayrılığı yasası
- **1944**: Kadınlara oy kullanma hakkı
- **1945**: İkinci Dünya Savaşı'nın sonu (8 Mayıs)
- **1958**: V. Cumhuriyet'in kuruluşu (4 Ekim Anayasası)

## Resmi tatiller ve anma günleri

- **14 Temmuz**: Ulusal Bayram (Bastille'in ele geçirilmesi)
- **11 Kasım**: 1918 Ateşkesi (Birinci Dünya Savaşı'nın sonu)
- **8 Mayıs**: 1945 Zaferi (Avrupa'da İkinci Dünya Savaşı'nın sonu)

## Coğrafya

- **Başkent**: Paris
- **Nüfus**: yaklaşık 68 milyon kişi
- **13 anakara bölgesi** ve 5 deniz aşırı bölge
- Fransa, yüzölçümü bakımından Avrupa Birliği'nin en büyük ülkesidir

## Aydınlanma (*les Lumières*)

Akıl, özgürlük ve ilerleme fikirlerini taşıyan 18. yüzyıl entelektüel hareketi. Başlıca isimler: Voltaire, Rousseau, Montesquieu, Diderot.$content$),

(5, 'en', 'Living in French society',
$content$# Living in French society

## Administrative procedures

- **Birth**: declaration at the town hall (*mairie*) within 5 days
- **Residence permit** (*titre de séjour*): application at the prefecture (*préfecture*)
- **Voter registration**: at the town hall or online
- **Carte Vitale**: health insurance card issued by the Sécurité sociale (the French social security system)

## Emergency numbers

- **15**: SAMU (medical emergencies)
- **17**: Police / *Gendarmerie*
- **18**: Fire brigade (*Pompiers*)
- **112**: European emergency number (works across the whole EU)

## Social protection

The Sécurité sociale (the French social security system) is the country's social protection system. It covers:
- Illness and maternity
- Retirement
- Family allowances (CAF — *Caisse d'allocations familiales*)
- Workplace accidents

## Employment

- **France Travail** (formerly *Pôle emploi*): support for job-seekers and unemployment benefits
- The SMIC (*salaire minimum interprofessionnel de croissance*, the statutory minimum wage) guarantees a minimum income to every worker
- The employment contract (CDI — open-ended; CDD — fixed-term) defines rights and obligations

## The republican integration contract (*contrat d'intégration républicaine*, CIR)

Newly arrived foreigners sign the CIR, which includes:
- A civic-training course on the values of the Republic
- French-language training (if needed)
- Support towards employment and housing$content$),

(5, 'tr', 'Fransız toplumunda yaşamak',
$content$# Fransız toplumunda yaşamak

## İdari işlemler

- **Doğum**: 5 gün içinde belediyeye (*mairie*) bildirim
- **Oturma izni** (*titre de séjour*): valiliğe (*préfecture*) başvuru
- **Seçmen kaydı**: belediyede veya çevrimiçi
- **Carte Vitale**: Sécurité sociale (Fransız sosyal güvenlik sistemi) tarafından verilen sağlık sigortası kartı

## Acil durum numaraları

- **15**: SAMU (tıbbi acil durumlar)
- **17**: Polis / *Gendarmerie*
- **18**: İtfaiye (*Pompiers*)
- **112**: Avrupa acil durum numarası (tüm AB'de çalışır)

## Sosyal koruma

Sécurité sociale (Fransız sosyal güvenlik sistemi) Fransa'nın sosyal koruma sistemidir. Şunları kapsar:
- Hastalık ve doğum
- Emeklilik
- Aile yardımları (CAF — *Caisse d'allocations familiales*)
- İş kazaları

## İstihdam

- **France Travail** (eski adıyla *Pôle emploi*): iş arama desteği ve işsizlik ödeneği
- SMIC (*salaire minimum interprofessionnel de croissance*, yasal asgari ücret) her çalışana asgari bir gelir güvence altına alır
- İş sözleşmesi (CDI — süresiz; CDD — süreli) hak ve yükümlülükleri tanımlar

## Cumhuriyetçi entegrasyon sözleşmesi (*contrat d'intégration républicaine*, CIR)

Yeni gelen yabancılar CIR'yi imzalar; bu sözleşme şunları içerir:
- Cumhuriyet'in değerleri üzerine vatandaşlık eğitimi
- Fransızca dil eğitimi (gerekli olduğunda)
- İstihdam ve konut için destek$content$)
ON CONFLICT (fiche_id, lang) DO NOTHING;
