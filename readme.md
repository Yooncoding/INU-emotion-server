# temp-u (인천대생의 오늘 하루 기분은 어떨까?) - server

## 기능

- [ O ] 로그인 (학교 포탈 로그인)
- [ O ] 회원가입
- [ ] 회원 정보 수정(닉네임변경)
- [ O ] 오늘 기분 제출 (기분, 요소 1~3가지), ( 07시 ~ 21시에만 제출가능 )
- [ O ] 오늘 현재 인천대생 기분 평균 보기
- [ O ] 오늘 현재 요소 순위 보기
- [ O ] 오늘 베팅 제출 ( 08시~19시에만 제출가능 )
- [ O ] 오늘 기분과 베팅 비교 후 사용자에게 점수 부여 ( 매일 23시 자동 )
- [ O ] 월간 점수 순위 보기 ( 1위 ~ 6위 ), ( 내 점수와 순위 보기 )
- [ O ] 점수 초기화 ( 매월 1일 자동 )
- [ O ] 오늘 최종 기분 데이터베이스에 저장 ( 매일 23시 55분 자동 )
- [ O ] 이번달 일별 기분 평균과 요소 순위 보기 ( 달력 형식 )
- [ ] 관리자 페이지 만들기 ( 유저관리 )

## Database

- MySQL
- Sequelize ORM

### User

| 이름      | 타입         | 기본값      | Null허용 |
| --------- | ------------ | ----------- | -------- |
| id        | int          |             |          |
| email     | varchar(40)  |             |          |
| password  | varchar(140) |             |          |
| nick      | varchar(15)  |             |          |
| point     | int          | 0           |          |
| createdAt | datetime     | currentTime |          |
| updatedAt | datetime     | currentTime |          |
| deletedAt | datetime     |             | O        |

### Mood

| 이름                         | 타입        | 기본값      | Null허용 |
| ---------------------------- | ----------- | ----------- | -------- |
| id                           | int         |             |          |
| select_mood                  | int         |             |          |
| element_first                | varchar(15) |             |          |
| element_second               | varchar(15) | null        | O        |
| element_third                | varchar(15) | null        | O        |
| createdAt                    | datetime    | currentTime |          |
| updatedAt                    | datetime    | currentTime |          |
| UserId (fk, User 1 : N Mood) | int         |             |          |

### Betting

| 이름                            | 타입     | 기본값      | Null허용 |
| ------------------------------- | -------- | ----------- | -------- |
| id                              | int      |             |          |
| bet_mood                        | int      |             |          |
| createdAt                       | datetime | currentTime |          |
| updatedAt                       | datetime | currentTime |          |
| UserId (fk, User 1 : N Betting) | int      |             |          |

### Archive

| 이름           | 타입        | 기본값      | Null허용 |
| -------------- | ----------- | ----------- | -------- |
| id             | int         |             |          |
| mood           | int         |             |          |
| date           | datetime    | currentTime |          |
| element_first  | varchar(15) |             |          |
| element_second | varchar(15) | null        | O        |
| element_third  | varchar(15) | null        | O        |

## API

- HOST_DOMAIN : [](http://13.209.236.78:2000/)[http://13.209.236.78:2000/](http://13.209.236.78:2000/)
- Content-Type : "application/x-www-form-urlencoded"

```
{
    "success": boolean // true 면 정상 반환, false 면 비정상 반환
    "message" : string // false 라면 메세지 확인 후 말씀 부탁.
    <data1> : any // default -> data:null
    <data2> : any // default -> data:null
		...
}

```

### 명세표

| 기능                                          | 방식 | url            | req.header                | req.body                                                      | res.json                                           |
| --------------------------------------------- | ---- | -------------- | ------------------------- | ------------------------------------------------------------- | -------------------------------------------------- |
| 로그인                                        | POST | /auth/login    |                           | { email, password }                                           | { success, message, token }                        |
| 회원가입                                      | POST | /auth/register |                           | { email, password, nick }                                     | { success, message }                               |
| 회원 정보 수정(닉네임변경)                    |      |                |                           |                                                               |                                                    |
| 메인페이지(닉네임, 내 점수보기)               | GET  | /main          | { authorization: Bearer } |                                                               | { success, message, nick, myPoint }                |
| 오늘 기분 제출                                | POST | /mood          | { authorization: Bearer } | { select_mood, element_first, element_second, element_third } | { success, message }                               |
| 오늘 현재 인천대생 기분 평균, 요소 순위 보기  | GET  | /mood          | { authorization: Bearer } |                                                               | { success, message, todayMoodAvg, elementRanking } |
| 오늘 베팅 제출                                | POST | /betting       | { authorization: Bearer } | { bet_mood }                                                  | { success, message }                               |
| 오늘 기분과 베팅 비교 후 사용자에게 점수 부여 | 자동 |                |                           |                                                               |                                                    |
| 월간 점수 순위 보기, 내 점수 순위 보기        | GET  | /betting       | { authorization: Bearer } |                                                               | { success, message, monthRanking, myPoint }        |
| 점수 초기화                                   | 자동 |                |                           |                                                               |                                                    |
| 오늘 최종 기분 데이터베이스에 저장            | 자동 |                |                           |                                                               |                                                    |
| 이번달 일별 기분 평균과 요소 순위 보기        | GET  | /archive       | { authorization: Bearer } |                                                               | { success, message, archive }                      |
| 관리자 페이지 만들기                          |      |                |                           |                                                               |                                                    |

## 결과예시

작성예정

## 기분 선택 원인

```jsx
const elements = [
  // 음식
  "집밥",
  "패스트푸드",
  "건강식",
  "외식",
  "배달",
  "디저트",
  // 대인관계
  "가족",
  "친구",
  "애인",
  "동료",
  "동기",
  "선후배",
  // 학업
  "시험",
  "과제",
  "성적",
  "공모전",
  "자격증",
  "대외활동",
  // 취미
  "영화",
  "게임",
  "독서",
  "여행",
  "요리",
  "휴식",
  // 건강
  "운동",
  "수면",
  "질병",
  "스트레스",
  "체중",
  "두통",
  // 기타
  "날씨",
  "업무",
  "교통",
  "행운",
  "불운",
  "이유없음",
];
```
