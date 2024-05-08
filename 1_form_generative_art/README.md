# form generative art

This is a rapid prototype of a simple project that collects user inputs from a form to generate art that combines multiple parts and alters colors.

Original post URL: https://www.dcard.tw/f/softwareengineer/p/255486262

## Task requirement:

-   Goal: 使用者回答幾個問題後跑出客製化的結果（類似 MBTI 那種測驗），但結果會是很多種小部件結合成一張圖片，每一種小部件也可能依據回答情況變更顏色。 (Create an image of a mixture of multiple small parts and change color based on the input answers)

-   Additional notes: 1.大方向去分類的話是主體內跟主體外的兩種，但要詳細可能有非常多種，假如現在是主體內分上中下三類，裡面可能各自還會有 A 款 B 款 C 款，有可能同款不同色，主要目前還沒開始製作沒辦法給一個確切的數字，但可能種類真的不少。

|:--:|
| 上 A-[r|g|b] B-[r|g|b] C-[r|g|b]|
|中 A-[r|g|b] B-[r|g|b] C-[r|g|b]|
|下 A-[r|g|b] B-[r|g|b] C-[r|g|b]|

^ at least 3*3*3 = 27

2.每個部件會有分別大致的位子，但可能會有一部分重疊或是需要銜接的問題，粗估是 20 種。

Every part's object contains the following information.

```json
{
    "fileUrl": "URL OF THE FILE",
    "x": 0,
    "y": 0,
    "z_indx": 0,
    "zoom_lv": 0
}
```

3.不會像 MBTI 這麼少，因為回答不同結果會不同，回答相同結果也可能會不同，像上面提到的 ABC 款，每個部件的 A 款都有組合的可能（這感覺牽扯到數學我完全不會算 😂 但目前也還沒有確切的數字 🙏）

## Begin development

1. open terminal or powershell
2. enter

```sh
git clone https://github.com/siraisisatoru/dcard-nandemoya.git
cd 1_form_generative_art/mainPage
npm i
npm run dev
```

## Customise Tasks

1. Update question list json
2. Update component list json
3. update renderLogic in App.jsx
