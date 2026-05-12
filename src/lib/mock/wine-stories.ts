/**
 * Wine Stories — 12개 featured wines의 와이너리 스토리
 *
 * 베타 피드백 §wineStory 반영. 각 entry는 wineId, wineryName, foundedYear,
 * location, history(3~4문단), funFact, philosophy를 포함.
 *
 * wineId는 wines.ts의 FEATURED_WINE_IDS와 1:1 매칭.
 */

import type { WineStory } from '@/types';

export const WINE_STORIES: WineStory[] = [
  {
    id: 'ws_bdx-margaux',
    wineId: 'bdx-margaux',
    wineryName: { ko: '샤또 마고', en: 'Château Margaux' },
    foundedYear: 1572,
    location: { ko: '프랑스, 보르도, 메독, 마고', en: 'France, Bordeaux, Médoc, Margaux' },
    history: {
      ko: '12세기 라모르 영주의 토지로 기록된 떼루아는 16세기 후반 레스토낙 가문이 와이너리로 정비하며 오늘의 형태를 갖추기 시작했다. 18세기 베르틴 영주가 카베르네 소비뇽을 도입하며 좌안 보르도의 현대적 블렌딩이 자리잡았다.\n\n1855년 메독 1등급 분류에서 4개 1er Grand Cru Classé 중 하나로 지정되었고, 토마스 제퍼슨이 1784년 방문 후 "최고의 보르도"라고 적어둔 와인이기도 하다. 1980년대 멘첼로풀로스 가문의 인수와 오프닐 컨설팅 이후 일관된 품질이 재정립되었다.\n\n2017년 와이너리 옆 노먼 포스터 설계의 새 양조장이 완공되어 정밀한 빈야드 구획별 양조가 가능해졌다. 현재 코린느 멘첼로풀로스가 운영하며, 그녀의 딸 알렉산드라가 차세대 디렉터로 합류했다.',
      en: 'The terroir was recorded as the land of Lord Lamothe in the 12th century, but the estate took its current shape only in the late 16th century when the Lestonnac family organized it as a winery. In the 18th century, Lord Berlon introduced Cabernet Sauvignon, anchoring the modern blending style of the Left Bank.\n\nIn the 1855 Médoc classification it was one of four First Growths, and Thomas Jefferson, after his 1784 visit, wrote of it as the finest of Bordeaux. After the Mentzelopoulos family acquired it in the 1980s, consulting from Émile Peynaud and later Paul Pontallier re-established consistent excellence.\n\nA new Norman Foster-designed cellar opened in 2017, enabling parcel-by-parcel vinification. The estate is now led by Corinne Mentzelopoulos, with her daughter Alexandra joining as the next-generation director.',
    },
    funFact: {
      ko: '토마스 제퍼슨이 1784년 방문 후 메모장에 적은 와인 — 그의 손글씨가 남아 있는 유일한 프랑스 와인이다.',
      en: 'After his 1784 visit, Thomas Jefferson wrote about this wine in his journal — the only French wine for which his handwriting survives.',
    },
    producerPhotoUrl: null,
    vineyardArea: '85 ha',
    philosophy: {
      ko: '"섬세함은 거친 추출로는 만들어지지 않는다." — 빈티지마다 그랑 뱅(Château Margaux)·세컨드(Pavillon Rouge)·서드(Margaux du Château Margaux)로 엄격히 선별하며, 빈야드의 약 38%만 1등급 라벨에 들어간다.',
      en: '"Finesse is never built by coarse extraction." Each vintage is rigorously divided into the Grand Vin (Château Margaux), the second wine (Pavillon Rouge), and a third — only about 38% of the vineyard reaches the first-label bottle.',
    },
  },
  {
    id: 'ws_bgy-romanee-st-vivant',
    wineId: 'bgy-romanee-st-vivant',
    wineryName: { ko: '도멘 드 라 로마네 콩티', en: 'Domaine de la Romanée-Conti' },
    foundedYear: 1232,
    location: { ko: '프랑스, 부르고뉴, 꼬뜨 드 뉘, 본 로마네', en: 'France, Burgundy, Côte de Nuits, Vosne-Romanée' },
    history: {
      ko: '1232년 시토회 수도원이 본 로마네의 토지를 일군 기록이 남아 있다. 1631년 크로낭부르 가문이 매입하며 단일 소유 빈야드의 전통이 시작되었다.\n\n1760년 콩티 공이 라 로마네 빈야드(현 Romanée-Conti)를 매입하면서 도멘 이름의 절반을 부여했다. 프랑스 혁명 후 국가에 압수되었다가 시민에게 매각되었고, 1869년 자크 마리 뒤보 블로셰가 매입하며 현재 운영 가문의 시조가 되었다.\n\n2009년 부르고뉴 클리마(climats)의 유네스코 등재 신청 시 도멘의 8개 그랑 크뤼(La Tâche, Romanée-Conti, Romanée-Saint-Vivant, Richebourg, Grands Échezeaux, Échezeaux, Le Montrachet, Corton)가 핵심 자산으로 인용되었다. 현재 빈야드 매니저 베르나르 노블레와 양조 책임 오베르 드 빌렌이 운영한다.',
      en: 'Records from 1232 show the Cistercian monks tilling lands at Vosne-Romanée. In 1631, the Croonembourg family purchased the vineyards, beginning the tradition of monopole stewardship.\n\nIn 1760, the Prince de Conti acquired the La Romanée vineyard (today\'s Romanée-Conti), giving the Domaine half of its name. After the Revolution, the estate was confiscated and resold; in 1869, Jacques-Marie Duvault-Blochet acquired it, founding the family line that runs the estate today.\n\nWhen Burgundy\'s climats were inscribed on the UNESCO World Heritage list, the Domaine\'s eight Grands Crus — La Tâche, Romanée-Conti, Romanée-Saint-Vivant, Richebourg, Grands Échezeaux, Échezeaux, Le Montrachet, and Corton — were cited as core assets. The estate is run today by vineyard director Bernard Noblet and winemaking head Aubert de Villaine.',
    },
    funFact: {
      ko: '도멘의 8개 그랑 크뤼 합계 면적은 25 ha에 불과하며, 연간 총 생산량은 약 7,000~8,000케이스로 보르도 1등급 한 곳의 1/15 수준이다.',
      en: "The Domaine's eight Grands Crus total only 25 ha; annual output of 7,000–8,000 cases is about one-fifteenth of a single Bordeaux First Growth.",
    },
    producerPhotoUrl: null,
    vineyardArea: '25 ha (8 Grands Crus)',
    philosophy: {
      ko: '"피노 누아는 와인메이커가 만드는 게 아니라 토양이 만드는 것이다." 신축 오크 사용 100%이지만 항상 같은 토노니에 쿠퍼리지에서 공급. 발효는 야생 효모, 청징 없이 병입.',
      en: '"Pinot Noir is made not by the winemaker but by the soil." 100% new oak — but always from the same François Frères/Tonnellerie cooperage. Native-yeast fermentation, no fining or filtration before bottling.',
    },
  },
  {
    id: 'ws_cha-krug-grande-cuvee',
    wineId: 'cha-krug-grande-cuvee',
    wineryName: { ko: '크룩', en: 'Krug' },
    foundedYear: 1843,
    location: { ko: '프랑스, 샹파뉴, 랭스', en: 'France, Champagne, Reims' },
    history: {
      ko: '독일 마인츠 출신의 요한 요세프 크룩이 1843년 랭스에 메종을 세웠다. 그는 빈티지의 약점을 보완하기 위해 리저브 와인을 활용하는 그란데 큐베 컨셉트를 1843년 첫 출시부터 일관되게 유지했다.\n\n1870년 그의 아들 폴 크룩이 회사를 이어받으며 영국 시장으로 빠르게 확장했다. 1962년 폴 크룩 2세가 LVMH 그룹에 매각했지만, 양조 결정은 여전히 크룩 가문이 독립적으로 유지하고 있다.\n\n현재 6대손 올리비에 크룩이 가문의 마지막 책임자로 활동 중이며, 와인메이커 줄리 카비올라가 양조의 일관성을 책임진다. 매년 발표되는 "Krug ID"는 그란데 큐베의 정확한 블렌딩과 리저브 빈티지 구성을 투명하게 공개하는 시스템이다.',
      en: 'Johann-Joseph Krug, born in Mainz, founded his house in Reims in 1843. From the very first bottling, he insisted on using reserve wines to compensate for vintage weakness — the foundation of the Grande Cuvée concept.\n\nHis son Paul Krug took over in 1870 and expanded rapidly into the British market. In 1962 the family sold the house to the LVMH group, but Krug retains autonomy over winemaking to this day.\n\nThe sixth-generation Olivier Krug now serves as the family\'s active steward, with cellar master Julie Cavil ensuring vintage-to-vintage consistency. The annual "Krug ID" publishes the precise blend composition of each Grande Cuvée — a transparent map of its reserve vintages.',
    },
    funFact: {
      ko: '그란데 큐베 한 병에 들어가는 와인은 평균 120종 이상이며, 가장 오래된 리저브는 15년 전 빈티지까지 거슬러 올라간다.',
      en: 'A single bottle of Grande Cuvée contains an average of 120+ different wines, with the oldest reserves reaching back as much as 15 vintages.',
    },
    producerPhotoUrl: null,
    vineyardArea: '21 ha (자가 빈야드)',
    philosophy: {
      ko: '"빈티지가 아니라 매년이다." 그란데 큐베는 모든 빈티지 후 단일 큐베로 통합되며, 약점이 있는 해에는 리저브로 메우고 강한 해에는 리저브를 비축한다.',
      en: '"It is not a vintage — it is every year." Grande Cuvée folds each harvest into a single house cuvée; weaker years are filled with reserves, stronger years deposit them.',
    },
  },
  {
    id: 'ws_tus-brunello-biondi-santi',
    wineId: 'tus-brunello-biondi-santi',
    wineryName: { ko: '비온디 산티', en: 'Biondi-Santi' },
    foundedYear: 1840,
    location: { ko: '이탈리아, 토스카나, 몬탈치노', en: 'Italy, Tuscany, Montalcino' },
    history: {
      ko: '클레멘테 산티가 19세기 중반 몬탈치노에서 산지오베제 그로소의 개별 클론을 선별·재배하기 시작했다. 그의 손자 페루치오 비온디 산티는 1888년 첫 빈티지 브루넬로를 출시하며 단일 품종 와인의 모델을 만들었다.\n\n1932년 무솔리니 정부의 산지오베제 블렌딩 의무화 시도에 반대하며 단일 품종의 정통성을 지킨 일화는 이탈리아 와인 역사의 전환점이다. 1969년 영국 와인 작가 휴 존슨이 비온디 산티의 1955년 빈티지를 "이탈리아 와인의 정점"으로 평하며 국제 무대에 알려졌다.\n\n2017년 EPI 그룹이 가문의 지분을 인수했지만 양조 철학과 리세르바 출시 기준은 그대로 유지된다. 현재 양조 책임은 페데리코 라델리가 맡고 있다.',
      en: 'Clemente Santi began selecting and propagating a clone of Sangiovese Grosso at Montalcino in the mid-19th century. His grandson Ferruccio Biondi-Santi released the first vintage of Brunello in 1888, establishing the model of a single-varietal wine.\n\nIn 1932, when Mussolini\'s government tried to mandate Sangiovese blending, Biondi-Santi defended monovarietal authenticity — a turning point in Italian wine history. In 1969, British wine writer Hugh Johnson praised the 1955 vintage as "the summit of Italian wine," and international recognition followed.\n\nIn 2017 the EPI group acquired the family\'s stake, but the winemaking philosophy and Riserva release criteria remain unchanged. Federico Radelli now leads winemaking.',
    },
    funFact: {
      ko: '리세르바 빈티지는 1888년부터 단 38회만 출시됐다 — 비온디 산티 가문이 "리세르바급 빈티지가 아니다"라고 판단한 해에는 아예 만들지 않는다.',
      en: 'Only 38 Riserva vintages have been released since 1888 — Biondi-Santi simply does not produce one in years deemed unworthy.',
    },
    producerPhotoUrl: null,
    vineyardArea: '25 ha',
    philosophy: {
      ko: '"오래된 슬라보니아 오크에서 5~7년." 새 오크의 흔적을 거의 주지 않고, 산지오베제 본연의 산미와 타닌이 시간을 견디게 한다.',
      en: '"Five to seven years in old Slavonian oak." Almost no new-oak imprint — Sangiovese\'s own acid and tannin must carry the wine across decades.',
    },
  },
  {
    id: 'ws_pie-barolo-giacomo-conterno',
    wineId: 'pie-barolo-giacomo-conterno',
    wineryName: { ko: '지아코모 콘테르노', en: 'Giacomo Conterno' },
    foundedYear: 1908,
    location: { ko: '이탈리아, 피에몬테, 몬포르테 달바', en: 'Italy, Piedmont, Monforte d\'Alba' },
    history: {
      ko: '지아코모 콘테르노가 1908년 몬포르테 달바에 작은 와이너리를 세웠다. 그의 아들 조반니 콘테르노가 1974년부터 카시나 프란치아 빈야드를 단독 매입하며 도멘의 정체성을 완성했다.\n\n전통주의자 대 모더니스트 논쟁이 격해진 1990년대에도 콘테르노는 거대한 슬라보니아 오크 보떼와 장기 침용을 고수했다. 그 결과 몬포르테의 클래식 스타일이 그대로 보존되었다.\n\n2003년부터 4대손 로베르토 콘테르노가 책임자로 활동하며 카시나 프란치아 외에 체레타 빈야드도 추가했다. 모노폴 빈야드의 단일 표현으로서 콘테르노 바롤로는 바롤로 전통주의의 마지막 보루로 자리매김했다.',
      en: 'Giacomo Conterno founded a small winery at Monforte d\'Alba in 1908. His son Giovanni purchased the entire Cascina Francia vineyard in 1974, completing the estate\'s identity.\n\nWhen the 1990s "traditionalist vs. modernist" wars consumed Barolo, Conterno held to large Slavonian botti and long macerations. As a result, the classical Monforte style was preserved intact.\n\nFrom 2003 the fourth-generation Roberto Conterno took over, adding the Cerretta vineyard alongside Cascina Francia. As a monopole expression, Conterno Barolo has become the last bastion of Barolo traditionalism.',
    },
    funFact: {
      ko: '카시나 프란치아의 와인은 발효·침용에만 60~90일이 걸리고, 그 후 슬라보니아 오크 보떼에서 약 7년을 더 숙성한다.',
      en: 'Fermentation and maceration at Cascina Francia run 60–90 days; the wine then ages another seven years in Slavonian oak botti.',
    },
    producerPhotoUrl: null,
    vineyardArea: '14 ha (Cascina Francia 단일 빈야드)',
    philosophy: {
      ko: '"네비올로에 새 오크는 사치다." 오로지 큰 슬라보니아 오크와 장기 침용으로 타닌의 곱고 긴 변형을 유도한다.',
      en: '"New oak is a luxury Nebbiolo does not need." Only large Slavonian oak and long macerations guide the slow, fine evolution of tannin.',
    },
  },
  {
    id: 'ws_rio-lopez-de-heredia',
    wineId: 'rio-lopez-de-heredia',
    wineryName: { ko: '로페즈 데 에레디아', en: 'R. López de Heredia' },
    foundedYear: 1877,
    location: { ko: '스페인, 리오하, 아로', en: 'Spain, Rioja, Haro' },
    history: {
      ko: '라파엘 로페즈 데 에레디아가 1877년 아로에 와이너리를 세웠다. 그는 보르도와 가까운 거리에서 양조 기법을 학습했고, 리오하에 미국 오크 캐스크와 장기 숙성 시스템을 정착시킨 인물 중 하나다.\n\n4대에 걸쳐 한 가족이 운영하며 현대화의 유혹을 거의 받아들이지 않은 와이너리로 알려져 있다. 토노니에·캐스크 제작은 와이너리 내부에서 자체적으로 진행되며, 1890년대에 지어진 셀러 구조와 거미줄이 그대로 남아 있다.\n\n2002년 자하 하디드가 설계한 와이너리 외관 증축은 보존과 현대의 대비를 의도한 것이며, 내부의 양조 철학은 변하지 않았다. 현재 메르세데스 로페즈 데 에레디아와 그녀의 동생들이 와이너리를 운영하고 있다.',
      en: 'Rafael López de Heredia founded the winery at Haro in 1877. He studied winemaking in nearby Bordeaux and was one of the figures who established American oak casks and long-aging regimes in Rioja.\n\nThe estate has been family-run for four generations and has resisted nearly every modernizing temptation. Cask production happens in-house, and the cellar structure built in the 1890s — complete with cobwebs — remains intact.\n\nA 2002 Zaha Hadid pavilion sits next to the historic estate as an intentional contrast, but the winemaking philosophy inside has not changed. The winery is now run by Mercedes López de Heredia and her siblings.',
    },
    funFact: {
      ko: '비냐 톤도니아 그란 리세르바는 출시까지 평균 10년 이상을 셀러에서 보낸다 — 와이너리가 마실 시점이 되었다고 판단할 때만 출시한다.',
      en: 'Viña Tondonia Gran Reserva spends an average of 10+ years in the cellar before release — the winery alone decides when the wine is ready.',
    },
    producerPhotoUrl: null,
    vineyardArea: '170 ha',
    philosophy: {
      ko: '"시간만이 와인을 만든다." 추출과 화학을 최소화하고, 미국 오크 캐스크와 셀러의 시간으로 와인을 빚는다.',
      en: '"Only time makes the wine." Minimal extraction and chemistry — American oak casks and patient cellaring shape the wine.',
    },
  },
  {
    id: 'ws_rhn-chateau-rayas',
    wineId: 'rhn-chateau-rayas',
    wineryName: { ko: '샤또 라야스', en: 'Château Rayas' },
    foundedYear: 1880,
    location: { ko: '프랑스, 론, 샤또네프 뒤 빠쁘', en: 'France, Rhône, Châteauneuf-du-Pape' },
    history: {
      ko: '1880년 알베르 레이노 박사가 부동산을 매입하며 와이너리의 역사가 시작됐다. 그의 아들 루이 레이노가 1920년대부터 100% 그르나슈 단일 품종 양조를 고수하며 라야스의 정체성을 만들었다.\n\n1978~1997년 자크 레이노가 책임자로 활동하며 셀러의 신비주의를 강화했다. 그의 일관된 양조 거부 — 어떤 컨설턴트도 들이지 않고, 신축 오크도 사용하지 않는다 — 가 와인 평론가들을 매료시켰다.\n\n1997년 자크의 사망 이후 그의 조카 엠마뉘엘 레이노가 운영을 이어받았다. 빈야드는 모래 토양 위에 자라는 그르나슈로, 샤또네프의 일반적인 갈렛(자갈) 토양과 정반대 떼루아 표현을 보여준다.',
      en: 'Dr. Albert Reynaud purchased the property in 1880, beginning the estate. From the 1920s his son Louis Reynaud insisted on 100% Grenache single-varietal winemaking — the identity of Rayas was born.\n\nJacques Reynaud directed the estate from 1978 to 1997 and amplified its cellar mystique. His consistent refusal — no consultants ever, no new oak — captivated critics.\n\nAfter Jacques\'s death in 1997, his nephew Emmanuel Reynaud took over. The vineyard sits on sandy soils — the opposite of the galets (large pebbles) typical of Châteauneuf — producing a uniquely Burgundian-feeling Grenache.',
    },
    funFact: {
      ko: '샤또네프의 다른 모든 와이너리가 갈렛 토양 위에 있을 때, 라야스는 모래 위에 자란다 — 그래서 라야스의 그르나슈는 부르고뉴 피노 같은 우아함을 보인다.',
      en: 'While every other Châteauneuf estate sits on galets, Rayas grows on sand — and so its Grenache shows a Burgundian Pinot-like grace.',
    },
    producerPhotoUrl: null,
    vineyardArea: '13 ha',
    philosophy: {
      ko: '"100% 그르나슈, 100% 본인의 손, 100% 시간." 어떤 양조 컨설턴트도 거부하고, 가족만이 의사 결정을 한다.',
      en: '"100% Grenache, 100% by our own hands, 100% time." No consulting winemakers; decisions belong to the family alone.',
    },
  },
  {
    id: 'ws_mos-egon-muller-scharzhof',
    wineId: 'mos-egon-muller-scharzhof',
    wineryName: { ko: '에곤 뮐러 샤르츠호프', en: 'Egon Müller Scharzhof' },
    foundedYear: 1797,
    location: { ko: '독일, 모젤, 자르, 빌팅엔', en: 'Germany, Mosel, Saar, Wiltingen' },
    history: {
      ko: '1797년 코블렌츠 출신 요한 외스터린이 샤르츠호프베르거 빈야드를 매입한 것이 와이너리의 시작이다. 1810년 그의 사후 빈야드는 그의 사위 펠릭스 콜러를 거쳐 1873년 에곤 뮐러 가문에 합쳐졌다.\n\n샤르츠호프베르거는 자르 강 지류의 회청색 슬레이트 경사지로, 평균 경사 60도에 가까운 가파른 빈야드다. 모든 작업이 수확뿐 아니라 가지치기까지 손으로만 이루어진다.\n\n에곤 뮐러 4세가 1991년부터 와이너리를 책임지고 있으며, 그의 아들 에곤 뮐러 5세가 후계자로 합류했다. 트로켄베에렌아우슬레제(TBA) 출시는 약 10년에 한 번 — 세계 와인 경매에서 단일 750ml가 1만 유로 이상에 팔리는 경우도 있다.',
      en: 'The estate began in 1797 when Johann Östelin of Koblenz purchased the Scharzhofberger vineyard. After his death in 1810, the vineyard passed through his son-in-law Felix Koch and in 1873 was absorbed by the Egon Müller family.\n\nScharzhofberger is a grey-blue slate slope along a tributary of the Saar, with an average gradient near 60°. Every task — pruning as well as harvest — is done by hand.\n\nEgon Müller IV has led the estate since 1991, with his son Egon V joining as successor. Trockenbeerenauslese (TBA) is released roughly once a decade — a single 750 ml has sold for over €10,000 at international auction.',
    },
    funFact: {
      ko: '에곤 뮐러 TBA는 750ml 단일 병이 와인 옥션에서 1만 유로를 넘기는 경우가 있다 — 세계에서 가장 비싼 화이트 와인 후보 중 하나.',
      en: 'A 750 ml bottle of Egon Müller TBA can exceed €10,000 at auction — a perennial candidate for the world\'s most expensive white wine.',
    },
    producerPhotoUrl: null,
    vineyardArea: '8.3 ha (Scharzhofberger 모노폴급)',
    philosophy: {
      ko: '"리슬링은 시간이 빚는다." 야생 효모, 대형 오크 보떼, 잔당과 산미의 비현실적 균형 — 어떤 빈티지든 50년을 견디게 양조한다.',
      en: '"Riesling is shaped by time." Native yeast, large oak fuder, and the unreal balance of sugar and acid — every vintage is built to last 50 years.',
    },
  },
  {
    id: 'ws_nap-screaming-eagle',
    wineId: 'nap-screaming-eagle',
    wineryName: { ko: '스크리밍 이글', en: 'Screaming Eagle' },
    foundedYear: 1992,
    location: { ko: '미국, 캘리포니아, 나파 밸리, 오크빌', en: 'USA, California, Napa Valley, Oakville' },
    history: {
      ko: '진 필립스가 1986년 50에이커의 부동산을 매입했고, 1992년 첫 빈티지가 출시되며 컬트 와인의 표본이 되었다. 와인메이커 하이디 바렛이 첫 4년간 양조를 맡으며 와이너리의 평판을 단단히 했다.\n\n2006년 진 필립스가 부동산 가격 폭등 후 스탠 크롱키와 찰스 뱅크스에게 매각했다. 새 오너십 아래에서 와인메이커는 앤디 에릭슨이었고, 2010년 빈티지부터는 닉 길리스가 책임진다.\n\n생산량은 연간 약 700~900케이스에 불과하며, 메일링 리스트가 약 1만 명을 넘는다. 한 병 가격이 출시 직후 1만 달러를 넘는 일이 드물지 않다 — 캘리포니아 컬트 와인 운동의 상징이다.',
      en: 'Jean Phillips bought the 50-acre property in 1986; the first vintage in 1992 became the model of a Napa cult wine. Heidi Barrett was the winemaker for the first four years, anchoring the estate\'s reputation.\n\nIn 2006 Phillips sold the property to Stan Kroenke and Charles Banks after real-estate values had soared. Andy Erickson became winemaker under the new ownership; from the 2010 vintage Nick Gislason has led the team.\n\nProduction is only 700–900 cases per year, and the mailing list has grown past 10,000 names. A bottle can break $10,000 within days of release — the icon of the California cult-wine movement.',
    },
    funFact: {
      ko: '2000년 자선 옥션에서 6L 단일 임페리얼 한 병이 50만 달러에 낙찰되며 와인 옥션 단가 기록을 새로 썼다.',
      en: 'At a 2000 charity auction, a single 6 L imperial sold for US$500,000 — a record for wine auction unit price at the time.',
    },
    producerPhotoUrl: null,
    vineyardArea: '23 ha (그중 양조용 약 1.2 ha)',
    philosophy: {
      ko: '"적은 양, 정밀한 빈야드 구획별 추출." 출시량을 인위적으로 늘리지 않으며, 메일링 리스트의 대기 기간이 10년 이상인 경우도 있다.',
      en: '"Small lots, parcel-precise extraction." Volume is never artificially expanded; mailing-list wait times can exceed 10 years.',
    },
  },
  {
    id: 'ws_por-niepoort-vintage-port',
    wineId: 'por-niepoort-vintage-port',
    wineryName: { ko: '니에포르트', en: 'Niepoort' },
    foundedYear: 1842,
    location: { ko: '포르투갈, 도우로', en: 'Portugal, Douro' },
    history: {
      ko: '네덜란드 출신의 프란츠 마리누스 반 더 니에포르트가 1842년 포르투에서 와이너리를 설립했다. 가문은 5대에 걸쳐 운영되며, 현재는 디르크 니에포르트가 5대손으로 와이너리를 이끈다.\n\n포트 와인이 도우로 와인 산업의 전부였던 시절을 지나, 디르크 니에포르트는 1990년대부터 도우로 스틸 와인(테이블 와인)의 가능성을 적극 탐구했다. 그의 "Redoma"와 "Charme" 라인은 도우로 스틸 와인 르네상스의 시발점이다.\n\n니에포르트 빈티지 포트는 도우로 강 상류 키엔타 두 카르모와 핀항 빈야드에서 나오며, 키엔타 두 카르모의 100년 이상 묵은 올드 바인이 핵심 자산이다. 매 빈티지마다 출시되는 것이 아니라 가문이 "선언" 가치가 있다고 판단한 해에만 출시한다.',
      en: 'Frans Marinus van der Niepoort, of Dutch origin, founded the house in Porto in 1842. The family has run it for five generations; today the fifth-generation Dirk Niepoort leads.\n\nBeyond the Port-dominated era, from the 1990s Dirk has actively explored the potential of Douro still wines. His "Redoma" and "Charme" lines were the spark of a Douro still-wine renaissance.\n\nThe Vintage Port comes from the upper Douro at Quinta do Carmo and Pinhão, with century-old vines at Quinta do Carmo at its core. It is released only in declared years — when the family judges the vintage worthy of "declaration."',
    },
    funFact: {
      ko: '니에포르트의 셀러 일부 코너에는 1800년대 빈티지 포트가 그대로 보관되어 있으며, 가족 이벤트에서만 열린다.',
      en: 'In a corner of the Niepoort cellars, 1800s Vintage Ports still rest, opened only at family events.',
    },
    producerPhotoUrl: null,
    vineyardArea: '40 ha (Quinta do Carmo · Pinhão 합계)',
    philosophy: {
      ko: '"빈티지 포트는 빈티지가 선언될 때만." 가문이 인정하는 해(보통 10년에 3~4번)에만 빈티지를 발표한다. 무리한 매출보다 명성의 일관성을 우선한다.',
      en: '"Vintage Port only when the vintage declares itself." The family declares only in years it deems worthy — typically 3–4 in 10 — prioritising consistent reputation over volume.',
    },
  },
  {
    id: 'ws_arg-catena-zapata-malbec',
    wineId: 'arg-catena-zapata-malbec',
    wineryName: { ko: '보데가 카테나 자파타', en: 'Bodega Catena Zapata' },
    foundedYear: 1902,
    location: { ko: '아르헨티나, 멘도사, 우코 밸리', en: 'Argentina, Mendoza, Uco Valley' },
    history: {
      ko: '이탈리아 마르케 출신의 니콜라 카테나가 1902년 멘도사에 와이너리를 세웠다. 그의 손자 니콜라스 카테나 자파타가 1980년대부터 아르헨티나 말벡을 국제 와인 무대로 끌어올린 인물이다.\n\n그는 캘리포니아 다이비스에서 와인을 공부하고 돌아와 안데스 산맥의 고도 빈야드(900~1500m)에서 말벡의 잠재력을 입증했다. 1990년대 후반 그의 딸 라우라 카테나가 양조에 합류하며 빈야드 구획별 양조 시스템을 정착시켰다.\n\n현재 카테나 자파타는 도멘 차크라, 보데가 카로(라피트 로칠드 합작) 등 여러 와이너리를 운영하며, 아르헨티나 와인 산업의 가족 챔피언으로 자리매김했다. 카테나 인스티튜트의 떼루아 연구 데이터는 멘도사 와인 산업 전체의 자산이다.',
      en: 'Nicola Catena, of Italian Marches origin, founded the winery in Mendoza in 1902. His grandson Nicolás Catena Zapata, from the 1980s, brought Argentine Malbec to the international stage.\n\nAfter studying viticulture at UC Davis, Nicolás proved Malbec\'s potential at Andean high-altitude vineyards (900–1,500 m). In the late 1990s his daughter Laura Catena joined and instituted parcel-by-parcel winemaking.\n\nCatena Zapata now operates several estates including Domaine Chacra and Bodega Caro (with Lafite Rothschild). The Catena Institute\'s terroir research has become an asset for the whole Mendoza industry.',
    },
    funFact: {
      ko: '보데가 카테나 자파타의 아드리아나 빈야드는 해발 약 1,500m로, 세계에서 가장 높은 양조용 빈야드 중 하나다.',
      en: 'The Adrianna Vineyard at Catena Zapata sits at roughly 1,500 m — among the highest commercial vineyards in the world.',
    },
    producerPhotoUrl: null,
    vineyardArea: '145 ha',
    philosophy: {
      ko: '"안데스의 고도가 말벡의 정체성을 만든다." 빈야드 구획별 정밀 양조, 떼루아 매핑, 그리고 우코 밸리의 차가운 밤이 빚는 말벡의 미네랄 균형.',
      en: '"Andean altitude makes Malbec\'s identity." Parcel-precise winemaking, deep terroir mapping, and the cold Uco Valley nights shape the wine\'s mineral balance.',
    },
  },
  {
    id: 'ws_aus-penfolds-grange',
    wineId: 'aus-penfolds-grange',
    wineryName: { ko: '펜폴즈', en: 'Penfolds' },
    foundedYear: 1844,
    location: { ko: '호주, 사우스 오스트레일리아, 바로사 밸리', en: 'Australia, South Australia, Barossa Valley' },
    history: {
      ko: '영국 의사 크리스토퍼 로슨 펜폴드가 1844년 호주로 이주해 의료용 와인을 만들기 위해 그레이트 사우스 와이너리를 세웠다. 1950년 와인메이커 맥스 슈버트가 보르도 견학에서 돌아와 호주 시라즈의 가능성을 시험하기 시작했다.\n\n1951년 슈버트가 첫 그란지 빈티지를 만들었지만, 펜폴즈 경영진은 새 오크 사용을 비판하며 양조 중단을 명령했다. 슈버트는 비밀리에 양조를 이어갔고, 1962년 시드니 와인 쇼에서 그란지가 최고 와인상을 휩쓸며 경영진을 침묵시켰다.\n\n그란지는 1995년 호주 국가 유물로 지정되었고, 2008년부터 피터 가고가 와인메이커로 책임지고 있다. 현재 펜폴즈는 트리저리 와인 이스테이츠 그룹의 일부이며, 그란지는 매년 약 8,000~10,000케이스가 생산된다.',
      en: 'British physician Christopher Rawson Penfold migrated to Australia in 1844 and founded the Grange to make medicinal wine. In 1950, winemaker Max Schubert returned from a Bordeaux study trip and began to test the potential of Australian Shiraz.\n\nIn 1951 Schubert made the first Grange vintage; Penfolds management criticised the use of new oak and ordered him to stop. Schubert continued in secret, and in 1962 Grange swept the Sydney Wine Show — silencing management forever.\n\nIn 1995 the Australian government designated Grange a National Heritage Icon. From 2008 Peter Gago has led winemaking. Penfolds is part of Treasury Wine Estates, and Grange now produces 8,000–10,000 cases annually.',
    },
    funFact: {
      ko: '그란지는 단일 빈야드가 아니라 매년 호주 전역(주로 바로사·맥라렌 베일·쿠나와라)에서 가장 좋은 시라즈를 선별·블렌딩한 와인이다.',
      en: 'Grange is not a single-vineyard wine — it is each year the best Shiraz selected and blended from across Australia (mainly Barossa, McLaren Vale, and Coonawarra).',
    },
    producerPhotoUrl: null,
    vineyardArea: 'multi-region sourced',
    philosophy: {
      ko: '"호주에서 가장 좋은 시라즈만 그란지에 들어간다." 어떤 빈티지에서도 그란지가 만들어질 수 있도록 빈야드 풀의 유연성을 유지하는 멀티 리전 블렌딩 철학.',
      en: '"Only the finest Shiraz in Australia makes it into Grange." Multi-regional blending keeps the vineyard pool flexible so Grange can be made in any vintage.',
    },
  },
];

export const WINE_STORIES_BY_WINE_ID: Record<string, WineStory> = WINE_STORIES.reduce<
  Record<string, WineStory>
>((acc, s) => {
  acc[s.wineId] = s;
  return acc;
}, {});

export const WINE_STORIES_BY_ID: Record<string, WineStory> = WINE_STORIES.reduce<
  Record<string, WineStory>
>((acc, s) => {
  acc[s.id] = s;
  return acc;
}, {});

export function getWineStory(wineId: string): WineStory | undefined {
  return WINE_STORIES_BY_WINE_ID[wineId];
}
