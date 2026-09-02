/* 퍼블리온 도서 데이터
 * 출처: Publion.dc.html (Claude Design) 의 BOOKS / SUBJECTS / HERO / SERIES.
 * 값을 바꾸지 않고 그대로 옮겼습니다.
 *
 * 신간 추가는 Design SOP 9장 절차를 따릅니다.
 *   1) BOOKS 에 항목 추가 (제목·부제·지은이·옮긴이·분야·정가·출간일)
 *   2) 표지 슬롯 cover-{id} 에 표지 이미지를 끌어다 놓기
 *   3) 신간 5단은 date 기준 자동 정렬이므로 별도 작업 없음
 *
 * pages·mm 는 2026-09-02 에 알라딘 상세페이지에서 ISBN 으로 수집했습니다.
 * 페이지에 그 책의 ISBN 이 실제로 있는지 확인한 뒤에만 값을 받았습니다.
 * 9번(살아가다 일하다 만들다)만 ISBN 주소가 없어 ItemId 346908027 에서
 * ISBN 일치를 확인하고 가져왔습니다.
 */

export const BOOKS = [
  {id:1,title:"언컨택트",sub:"더 많은 연결을 위한 새로운 시대 진화 코드",author:"김용섭",trans:"",subject:"경제경영 Business",price:18000,year:2020,ym:"2020년 4월",date:"2020.04.20",award:"2020 교보문고 올해의책",tone:"#111111",ink:"#FFFFFF",isbn:"9791197016806",kyobo:"S000001982855",pages:312,mm:"148×210mm"},
  {id:2,title:"나를 믿고 일한다는 것",sub:"나와 우리를 성장시키는 진짜 유능함에 대하여",author:"우미영",trans:"",subject:"자기계발 Self-development",price:16000,year:2020,ym:"2020년 11월",date:"2020.11.05",award:"",tone:"#EFEFEC",ink:"#111111",isbn:"9791197016837",kyobo:"S000001982856",pages:256,mm:"128×188mm"},
  {id:3,title:"알터 에고 이펙트",sub:"대체자아 활성화 가이드",author:"토드 허먼",trans:"전리오 옮김",subject:"자기계발 Self-development",price:18000,year:2021,ym:"2021년 1월",date:"2021.01.27",award:"",tone:"#EFEFEC",ink:"#111111",isbn:"9791197016851",kyobo:"S000001982858",pages:400,mm:"145×215mm"},
  {id:4,title:"프로페셔널 스튜던트",sub:"위기를 기회로 만드는 사람들의 생존코드",author:"김용섭",trans:"",subject:"자기계발 Self-development",price:18000,year:2021,ym:"2021년 2월",date:"2021.02.18",award:"",tone:"#EFEFEC",ink:"#111111",isbn:"9791197016875",kyobo:"S000001982859",pages:336,mm:"128×188mm"},
  {id:5,title:"당신은 다른 사람의 성공에 기여한 적 있는가?",sub:"대전환 시대의 새로운 성장 방정식, 파트너십",author:"이소영",trans:"",subject:"경제경영 Business",price:17000,year:2021,ym:"2021년 3월",date:"2021.03.25",award:"",tone:"#111111",ink:"#FFFFFF",isbn:"9791197016899",kyobo:"S000001982860",pages:280,mm:"148×210mm"},
  {id:6,title:"콘텐츠 가드닝",sub:"이르는 삶에서 기르는 삶으로",author:"서민규",trans:"",subject:"자기계발 Self-development",price:15000,year:2021,ym:"2021년 6월",date:"2021.06.18",award:"",tone:"#EFEFEC",ink:"#111111",isbn:"9791191587029",kyobo:"S000001952120",pages:240,mm:"118×188mm"},
  {id:7,title:"결국 Z세대가 세상을 지배한다",sub:"Z세대, 그들이 바꿀 미래의 단서들",author:"김용섭",trans:"",subject:"경제경영 Business",price:18000,year:2021,ym:"2021년 8월",date:"2021.08.10",award:"",tone:"#111111",ink:"#FFFFFF",isbn:"9791191587067",kyobo:"S000001952121",pages:328,mm:"148×210mm"},
  {id:8,title:"아마존 언바운드",sub:"제프 베이조스, 그리고 글로벌 제국의 발명",author:"브래드 스톤",trans:"전리오 옮김",subject:"경제경영 Business",price:33000,year:2021,ym:"2021년 12월",date:"2021.12.01",award:"2022 세종도서 교양부문 선정",tone:"#111111",ink:"#FFFFFF",isbn:"9791191587098",kyobo:"S000001952122",pages:832,mm:"150×225mm"},
  {id:9,title:"살아가다 일하다 만들다",sub:"미나 페르호넨 이야기",author:"미나가와 아키라",trans:"김지영 옮김",subject:"자기계발 Self-development",price:17000,year:2022,ym:"2022년 1월",date:"2022.01.20",award:"",tone:"#EFEFEC",ink:"#111111",isbn:"9791191587111",kyobo:"S000001952123",pages:308,mm:"128×188mm"},
  {id:10,title:"감성 콘텐츠",sub:"롱런 브랜드를 만드는 35가지 콘텐츠 공식",author:"가혜숙",trans:"",subject:"경제경영 Business",price:17000,year:2022,ym:"2022년 3월",date:"2022.03.22",award:"",tone:"#111111",ink:"#FFFFFF",isbn:"9791191587135",kyobo:"S000001952124",pages:272,mm:"140×200mm"},
  {id:11,title:"캐리비안 해적들의 비밀 공부법",sub:"스스로 학습하고 열정을 추구하는 사람들의 위대한 비밀",author:"제임스 마커스 바크",trans:"전리오 옮김",subject:"자기계발 Self-development",price:18000,year:2022,ym:"2022년 4월",date:"2022.04.15",award:"",tone:"#EFEFEC",ink:"#111111",isbn:"9791191587159",kyobo:"S000001952125",pages:352,mm:"145×210mm"},
  {id:12,title:"ESG 2.0",sub:"자본주의가 선택한 미래 생존 전략",author:"김용섭",trans:"",subject:"경제경영 Business",price:22000,year:2022,ym:"2022년 7월",date:"2022.07.01",award:"",tone:"#111111",ink:"#FFFFFF",isbn:"9791191587241",kyobo:"S000061353993",pages:432,mm:"148×210mm"},
  {id:13,title:"휴먼 프런티어",sub:"초연결시대에 생각해보는 거대한 아이디어의 미래",author:"마이클 바스카",trans:"전리오 옮김",subject:"인문 Humanities",price:25000,year:2022,ym:"2022년 10월",date:"2022.10.01",award:"2023 세종도서 교양부문 선정",tone:"#D8DCD6",ink:"#111111",isbn:"9791191587272",kyobo:"S000061898441",pages:680,mm:"145×225mm"},
  {id:14,title:"플래닛 B는 없다",sub:"하나뿐인 지구에서 살아남기 위한 150가지 질문과 대답",author:"마이크 버너스-리",trans:"전리오 옮김",subject:"인문 Humanities",price:25000,year:2022,ym:"2022년 12월",date:"2022.12.01",award:"",tone:"#D8DCD6",ink:"#111111",isbn:"9791191587302",kyobo:"S000200337477",pages:616,mm:"145×225mm"},
  {id:15,title:"어치브 모어",sub:"일과 삶에서 승률을 높이는 성취의 기술",author:"김성미",trans:"",subject:"자기계발 Self-development",price:18000,year:2022,ym:"2022년 12월",date:"2022.12.10",award:"",tone:"#EFEFEC",ink:"#111111",isbn:"9791191587296",kyobo:"S000200408270",pages:356,mm:"145×210mm"},
  {id:16,title:"나는 나를 응원합니다",sub:"",author:"칭고",trans:"아넬리스 그림",subject:"어린이 Children's",price:22000,year:2022,ym:"2022년 12월",date:"2022.12.25",award:"",tone:"#F2D53C",ink:"#111111",isbn:"9791191587319",kyobo:"S000200547148",pages:328,mm:"128×188mm"},
  {id:17,title:"기후피해세대를 넘어 기후기회세대로",sub:"인류의 미래를 위한 도전",author:"이재형",trans:"",subject:"인문 Humanities",price:18000,year:2023,ym:"2023년 1월",date:"2023.01.30",award:"2022 중소출판사 출판콘텐츠 창작지원사업 선정",tone:"#D8DCD6",ink:"#111111",isbn:"9791191587357",kyobo:"S000200762573",pages:368,mm:"148×210mm"},
  {id:18,title:"아웃스탠딩 티처",sub:"더 나아질 미래를 원하는 사람들의 성장코드",author:"김용섭",trans:"",subject:"자기계발 Self-development",price:20000,year:2023,ym:"2023년 3월",date:"2023.03.24",award:"",tone:"#EFEFEC",ink:"#111111",isbn:"9791191587388",kyobo:"S000201320919",pages:348,mm:"128×188mm"},
  {id:19,title:"알아차림에 대한 알아차림",sub:"",author:"루퍼트 스파이라",trans:"김주환 옮김",subject:"인문 Humanities",price:18000,year:2023,ym:"2023년 5월",date:"2023.05.25",award:"",tone:"#D8DCD6",ink:"#111111",isbn:"9791191587418",kyobo:"S000202387380",pages:204,mm:"128×188mm"},
  {id:20,title:"독서의 기록",sub:"내 인생을 바꾸는 작은 기적",author:"안예진",trans:"",subject:"자기계발 Self-development",price:18000,year:2023,ym:"2023년 6월",date:"2023.06.15",award:"",tone:"#EFEFEC",ink:"#111111",isbn:"9791191587425",kyobo:"S000202672654",pages:268,mm:"128×188mm"},
  {id:21,title:"기술이 만드는 미래 WEB 3.0과 블록체인",sub:"",author:"야마모토 야스마사",trans:"박제이 옮김",subject:"경제경영 Business",price:18000,year:2023,ym:"2023년 8월",date:"2023.08.23",award:"",tone:"#111111",ink:"#FFFFFF",isbn:"9791191587494",kyobo:"S000208693272",pages:232,mm:"128×188mm"},
  {id:22,title:"집이 나에게 물어온 것들",sub:"시간의 틈에서 건져 올린 집, 자연, 삶",author:"장은진",trans:"",subject:"인문 Humanities",price:19500,year:2023,ym:"2023년 9월",date:"2023.09.09",award:"2023 중소출판사 출판콘텐츠 창작지원사업 선정",tone:"#D8DCD6",ink:"#111111",isbn:"9791191587500",kyobo:"S000209030725",pages:336,mm:"125×210mm"},
  {id:23,title:"파견자들",sub:"김초엽 장편소설",author:"김초엽",trans:"",subject:"문학 Literature",price:19000,year:2023,ym:"2023년 10월",date:"2023.10.13",award:"2024 문학나눔 도서 선정 · 2024 예스24 올해의책",tone:"#1B2A4A",ink:"#FFFFFF",isbn:"9791191587524",kyobo:"S000210802440",pages:432,mm:"135×210mm"},
  {id:24,title:"긱 이코노미가 바꾸는 일의 미래",sub:"필요한 만큼만 맡기고, 원하는 만큼만 일하는",author:"방승천",trans:"",subject:"경제경영 Business",price:20000,year:2023,ym:"2023년 11월",date:"2023.11.10",award:"",tone:"#111111",ink:"#FFFFFF",isbn:"9791191587548",kyobo:"S000211235599",pages:304,mm:"148×210mm"},
  {id:25,title:"빛을 향한 여행",sub:"머묾과 떠남",author:"장클로드 드크레센조",trans:"이소영 옮김",subject:"문학 Literature",price:19000,year:2023,ym:"2023년 12월",date:"2023.12.10",award:"",tone:"#1B2A4A",ink:"#FFFFFF",isbn:"9791191587555",kyobo:"S000211613887",pages:216,mm:"138×210mm"},
  {id:26,title:"NEW SPACE",sub:"이미 시작된 우주 자본의 시대",author:"이임복",trans:"",subject:"경제경영 Business",price:19000,year:2024,ym:"2024년 2월",date:"2024.02.07",award:"",tone:"#111111",ink:"#FFFFFF",isbn:"9791191587609",kyobo:"S000212257384",pages:276,mm:"120×190mm"},
  {id:27,title:"리더의 각성",sub:"위기의 한국 기업, 스트롱 리더십이 답이다",author:"김용섭",trans:"",subject:"경제경영 Business",price:20000,year:2024,ym:"2024년 4월",date:"2024.04.01",award:"",tone:"#111111",ink:"#FFFFFF",isbn:"9791191587623",kyobo:"S000212797606",pages:328,mm:"148×210mm"},
  {id:28,title:"위너 셀즈 올",sub:"소매업계의 강자가 되기 위한 아마존과 월마트의 기업 간 전투",author:"제이슨 델 레이",trans:"전리오 옮김",subject:"경제경영 Business",price:23000,year:2024,ym:"2024년 6월",date:"2024.06.20",award:"",tone:"#111111",ink:"#FFFFFF",isbn:"9791191587661",kyobo:"S000213609211",pages:552,mm:"145×225mm"},
  {id:29,title:"오래된 책들의 메아리",sub:"",author:"바버라 데이비스",trans:"박산호 옮김",subject:"문학 Literature",price:19000,year:2024,ym:"2024년 6월",date:"2024.06.24",award:"2025 문학나눔 도서 선정",tone:"#1B2A4A",ink:"#FFFFFF",isbn:"9791191587678",kyobo:"S000213624898",pages:608,mm:"135×210mm"},
  {id:30,title:"문자의 역사",sub:"인류 문명사와 함께한 문자의 탄생과 발전",author:"스티븐 로저 피셔",trans:"강주헌 옮김",subject:"인문 Humanities",price:33000,year:2024,ym:"2024년 11월",date:"2024.11.01",award:"2025 세종도서 교양부문 선정",tone:"#D8DCD6",ink:"#111111",isbn:"9791191587715",kyobo:"S000214645192",pages:472,mm:"152×225mm"},
  {id:31,title:"미나 페르호넨 디자인 여정: 기억의 순환",sub:"",author:"미나가와 아키라",trans:"서하나 옮김",subject:"인문 Humanities",price:43000,year:2024,ym:"2024년 11월",date:"2024.11.01",award:"",tone:"#D8DCD6",ink:"#111111",isbn:"9791191587722",kyobo:"S000214614863",pages:328,mm:"200×280mm"},
  {id:32,title:"여행의 기록",sub:"기억을 기록으로 바꾸는 여행법",author:"안예진",trans:"",subject:"자기계발 Self-development",price:19000,year:2024,ym:"2024년 11월",date:"2024.11.11",award:"",tone:"#EFEFEC",ink:"#111111",isbn:"9791191587739",kyobo:"S000214645050",pages:288,mm:"128×188mm"},
  {id:33,title:"사물의 투명성",sub:"경험의 본질을 관조하다",author:"루퍼트 스파이라",trans:"김주환 옮김",subject:"인문 Humanities",price:22000,year:2025,ym:"2025년 1월",date:"2025.01.23",award:"",tone:"#D8DCD6",ink:"#111111",isbn:"9791191587760",kyobo:"S000215569687",pages:332,mm:"148×210mm"},
  {id:34,title:"당신과 함께, 유럽",sub:"여행 작가 양영훈의 다시 찾고 싶은 유럽 도시 기행",author:"양영훈",trans:"",subject:"인문 Humanities",price:25000,year:2025,ym:"2025년 4월",date:"2025.04.01",award:"",tone:"#D8DCD6",ink:"#111111",isbn:"9791191587791",kyobo:"S000216144605",pages:484,mm:"148×210mm"},
  {id:35,title:"나는 언제나 나",sub:"",author:"루퍼트 스파이라",trans:"주잔나 첼레이 그림 · 김주환 옮김",subject:"어린이 Children's",price:18000,year:2025,ym:"2025년 8월",date:"2025.08.01",award:"",tone:"#F2D53C",ink:"#111111",isbn:"9791191587814",kyobo:"S000217119016",pages:52,mm:"225×304mm"},
  {id:36,title:"나는 고독한 별처럼",sub:"",author:"이케자와 하루나",trans:"서하나 옮김",subject:"문학 Literature",price:18000,year:2025,ym:"2025년 11월",date:"2025.11.25",award:"",tone:"#1B2A4A",ink:"#FFFFFF",isbn:"9791191587821",kyobo:"S000218639567",pages:276,mm:"125×190mm"},
  {id:37,title:"10대의 독서",sub:"읽고, 묻고, 나아가는 독서의 힘",author:"류지후",trans:"",subject:"자기계발 Self-development",price:18000,year:2026,ym:"2026년 2월",date:"2026.02.02",award:"",tone:"#EFEFEC",ink:"#111111",isbn:"9791191587838",kyobo:"S000219128807",pages:288,mm:"135×210mm"},
  {id:38,title:"가든 타임",sub:"단단한 삶을 위한 시간",author:"이소원",trans:"",subject:"인문 Humanities",price:23000,year:2026,ym:"2026년 2월",date:"2026.02.10",award:"",tone:"#D8DCD6",ink:"#111111",isbn:"9791191587845",kyobo:"S000219195011",pages:332,mm:"148×210mm"},
  {id:39,title:"아이엠",sub:"존재에 대한 명상",author:"루퍼트 스파이라",trans:"김주환 옮김",subject:"인문 Humanities",price:16000,year:2026,ym:"2026년 4월",date:"2026.04.01",award:"",tone:"#D8DCD6",ink:"#111111",isbn:"9791191587883",kyobo:"S000219523297",pages:144,mm:"110×175mm"},
  {id:40,title:"현금경영",sub:"33년 경영 현장의 CEO가 알려주는 현금 생존법",author:"김성호",trans:"",subject:"경제경영 Business",price:22000,year:2026,ym:"2026년 5월",date:"2026.05.01",award:"",tone:"#111111",ink:"#FFFFFF",isbn:"9791191587906",kyobo:"S000220053056",pages:392,mm:"148×210mm"},
  {id:41,title:"인간이 유리하다",sub:"AI 시대, 인간에게만 허락된 것",author:"김용섭",trans:"",subject:"경제경영 Business",price:23000,year:2026,ym:"2026년 7월",date:"2026.07.01",award:"",tone:"#111111",ink:"#FFFFFF",isbn:"9791191587937",kyobo:"S000220588157",pages:344,mm:"140×210mm"}
];

export const SUBJECTS = ["경제경영 Business","자기계발 Self-development","인문 Humanities","문학 Literature","어린이 Children's"];

export const HERO = [
  {bookId:41, kicker:"신간 New Release", slotId:"hero-1", title:"인간이 유리하다",
   desc:"AI가 대부분의 일을 대신하는 시대에, 인간에게만 남는 것은 무엇인가. 김용섭 소장의 새 트렌드 분석서.",pages:344,mm:"140×210mm"},
  {bookId:23, kicker:"퍼블리온 문학", slotId:"hero-2", title:"파견자들",
   desc:"2024 문학나눔 도서 · 예스24 올해의책 선정. 김초엽 장편소설."},
  {bookId:30, kicker:"인문", slotId:"hero-3", title:"문자의 역사",
   desc:"2025 세종도서 교양부문 선정. 스티븐 로저 피셔가 추적한 문자의 탄생과 발전, 강주헌 옮김."}
];

export const SERIES = [
  {name:"TREND INSIGHT", slotId:"series-1", subject:"경제경영 Business", note:"김용섭 소장과 함께 펴내는 트렌드 분석 시리즈."},
  {name:"명상의 정수", slotId:"series-2", subject:"인문 Humanities", note:"루퍼트 스파이라의 저작 4종을 김주환 교수의 번역으로 소개합니다."},
  {name:"기록 시리즈", slotId:"series-3", subject:"자기계발 Self-development", note:"안예진의 『독서의 기록』 『여행의 기록』. 남기는 일에 관한 책."}
];
