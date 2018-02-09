# mum-essay-server

## 최종 리스트 작성
운영 주최측에서 순서를 작성하면 최종 발표 순서를 입력
mySQL 형식으로 변환하기 위해 엑셀에서 변환 

```sql
    UPDATE `person` SET `memberOrder` = '1' WHERE `person`.`name` LIKE '이름%';
+ TEST
```
![엑셀 샘플](https://i.imgur.com/Oj5G0t4.jpg)

## 발표자배경 최종 rendering
최종 랜더링 페이지: [http://eshell.iptime.org:3000/1/render](link)
