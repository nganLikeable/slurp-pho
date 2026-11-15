# Húp Phở project

As of 2026-11-14

## Overview

Húp Phở is a one-page browser game where you slurp a bowl of Vietnamese noodles empty as fast as you can, using the microphone or a hold button. It is a prototype: playable, but not yet play-tested or balanced.

- **Audience:** Vietnamese Gen Z on Threads, TikTok and Zalo. The interface is in Vietnamese.
- **Model:** the same shape as Nón Lá, the L/N pronunciation game that went viral on Threads in November 2026. One mechanic, no install, an unusual input, and an in-joke everyone already shares.
- **Why it could spread:** the player is the content. Someone slurping loudly at their phone in a café is the clip, and each run ends with a big stamped result card worth a screenshot.
- **Where it is:** the [playable page](https://claude.ai/artifact/87YLrrBnLv7unVFp5B22At) and a single `index.html` file with the same code.

## How the game plays

A run is one bowl against the clock: the timer starts on your first slurp and stops when the bowl is empty.

1. Pick a dish, or play the daily bowl.
2. Slurp to drain the bowl. One long slurp drains faster than short sips.
3. React to whatever floats up, and rest before your breath runs out.
4. Empty the bowl to get a time and a title on a result card.

Every dish shares these mechanics, and each adds one rule of its own.

| Mechanic | What happens | Cost or reward |
| --- | --- | --- |
| Breath (Hơi) | Drains in about 3.2 seconds of slurping, refills in about 1.2 seconds of rest | Run it dry and you gasp for 2 seconds |
| Chili (Ớt) | Blinks for half a second, then floats for a second | Slurp while it floats and you choke for 1.5 seconds |
| Quẩy | Floats for about 1.3 seconds | Slurp while it floats and the bowl drops 7% |
| Long noodle (Sợi dài) | Up to twice per bowl; release, then slurp unbroken for 1.6 seconds | Finish it for an 8% bonus; break it and 12% falls back in |

**Controls:** press "Bắt đầu húp". If the mic is off it asks for permission, measures the room's background noise for one second, then the run starts and the clock runs; only real slurps into the mic drain the bowl. "Tắt mic" pauses the run. There is no hold-to-slurp button or keyboard slurp any more, so the game needs a working mic. Tap the bowl (or press X) to pick out bones and shells. Steam rises from the bowl while you eat.

**Screen layout** (one centred column):
- the big red sign;
- a row with "Tô hôm nay" on the left and the menu ("30 tô"), sound and language (VI/EN) buttons on the right;
- the dish name between ‹ › arrows, with its rule in a chip that has a small icon;
- the bowl;
- one round yellow "HÚP" button. During a run it shows the clock and turns red while you slurp. Its outer ring shows what is left in the bowl, and its thin inner ring shows your air, turning red when it runs low;
- "Tìm đối thủ", "Múc tô mới" and, while the mic is on, "Tắt mic" as quiet links underneath.

**Titles:** Thánh Húp, Húp như bố, Tạm được, or Ăn như mèo, set by how close your time is to a simulated ideal run of that dish.

## The 30 dishes

There are 30 dishes in four groups, and each adds one rule on top of the shared mechanics.

| # | Dish | Group | Its rule |
| --- | --- | --- | --- |
| 1 | Phở bò | North | Basic rules only; the tutorial bowl |
| 2 | Phở gà | North | Quẩy floats up constantly |
| 3 | Bún chả | North | Each slurp lasts 1 second at most, then release and go again |
| 4 | Bún riêu | North | Must eat 3 toppings before the bowl can finish |
| 5 | Bún đậu mắm tôm | North | Breath recovers at half speed |
| 6 | Bún thang | North | Mostly long noodles, up to 5 per bowl |
| 7 | Bún ốc | North | Snail shells appear; tap the bowl to pick them out |
| 8 | Miến lươn | North | Slippery: the bowl refills while you rest |
| 9 | Bánh đa cua | North | The first half second of every slurp does nothing |
| 10 | Mì vằn thắn | North | Harmless orange carrot that looks like chili |
| 11 | Bún bò Huế | Central | Double chili; thick noodles reward long slurps |
| 12 | Mì Quảng | Central | Starts 70% full, but breath is short |
| 13 | Cao lầu | Central | Chewy: short slurps do almost nothing |
| 14 | Bún chả cá | Central | Fish bones to tap out, plus normal chili |
| 15 | Bánh canh | Central | Noodles swell: the bowl slowly refills over time |
| 16 | Bún hến | Central | Must eat 5 clams before the bowl can finish |
| 17 | Phở khô Gia Lai | Central | Two bowls: the dry one, then the soup |
| 18 | Hủ tiếu Nam Vang | South | Chili gives almost no warning |
| 19 | Hủ tiếu gõ | South | Half-size bowl, nothing floats up; pure speed |
| 20 | Bún mắm | South | The vendor tops the bowl up twice |
| 21 | Phở xe lửa | South | Giant bowl, drains at 60% speed |
| 22 | Bún thịt nướng | South | Lime floats up and must be slurped, or the bowl refills |
| 23 | Hủ tiếu bò kho | South | Too hot for long slurps in the first 4 seconds |
| 24 | Bún suông | South | Long noodles and a slippery bowl together |
| 25 | Mì tôm | Instant and modern | Mom looks over; stop or get scolded for 2 seconds |
| 26 | Mì ly | Instant and modern | One breath: release midway and the cup refills |
| 27 | Mì cay 7 cấp | Instant and modern | Chili 2.5 times as often, and short breath |
| 28 | Mì trộn | Instant and modern | Only the part of each slurp between 0.5 and 1.5 seconds counts |
| 29 | Lẩu mì | Instant and modern | Friends add noodles to the pot three times; more chili |
| 30 | Tô thập cẩm đặc biệt | Instant and modern | Final boss: every hazard at once |

## Look and feel

The page is styled as a street stall: a red and yellow hand-painted sign on a mint wall, with the bowl on a steel table and an illustrated menu book one tap away.

- **Bowl:** see-through, so the broth colour shows through the side. Toppings sit large on the surface, and faint noodles and toppings bob inside the liquid at about 30% opacity.
- **Broth:** shimmers gently. The animation is off for people with reduced motion turned on.
- **Draining:** the liquid level drops through the bowl and the surface narrows with the bowl's shape. "SẠCH!" shows on the bottom when it is empty.
- **Vessels:** each dish can have its own container. Mì ly is a cup with a peeled lid, and lẩu mì is a pot with handles on a burner. The other 28 use the bowl.
- **Menu book:** opens over the game from "Thực đơn 30 tô" (or "Cách chơi"). Five spreads: how to play, then Miền Bắc, Miền Trung, Miền Nam and Mì gói, each with its own colours, landmarks and animated scene. It is built mobile first: phones show one half page at a time, and from 641px wide the book opens to two pages and turns a whole spread. The "Húp Phở" sign sits at the top. Each card shows the bowl, its rule and your best time. A panel under the book shows the chosen dish with a big steaming bowl, its region and place ("Miền Trung · Món 3/7"), its rule and a "Húp tô này" button; it starts on the dish being played. The first tap on a card shows it there; the second, or the button, stamps "CHỌN!" and loads the dish. The game clock pauses while the book is open.
- **Themes:** light and dark, following the viewer's setting.
- **Language:** a VI | EN switch at the top of the game and in the menu. Vietnamese is the default; the choice is saved on the device. Every interface word, message, rule, title and result switch over in place, even mid-bowl. Dish names stay in Vietnamese, and English times use a decimal point instead of a comma.

## Retention

Expect a spike of a week or two, as with any joke game. The aim is a daily reason to open it and a reason to come back when a friend pokes you.

**Built**

- **Tô hôm nay:** one dish per day, rotating through all 30. Only the first attempt counts, and it tracks a day streak.
- **Personal bests:** one per dish, shown on the menu cards.
- **Result card:** slides up when the bowl is clean, with a stamped verdict ("SẠCH TÔ!", or "THẮNG!", "THUA!" or "HÒA!" in a 1v1), the time and title, and confetti and a chime on a win. "Đóng" closes it; after a race the main button reopens it. The old copy-result button was removed.

**Planned, needs a backend**

- **Thách đấu links:** a link carrying your time, so a friend races it.
- **Group boards:** a private leaderboard for a class, office or friend group.
- **Hà Nội vs Sài Gòn:** a city scoreboard that resets every Monday.
- **New and seasonal dishes:** one every week or two, plus Tết and rainy-season specials.

**Deliberately left out:** accounts, coins, upgrades and push notifications. They add friction to a game whose appeal is opening a link and slurping within five seconds.

## 1v1 random matching

Built as live matchmaking through a small Node.js server in `server/`, which you host yourself. Without the server, solo play works as before and "Tìm đối thủ" explains that 1v1 needs the server.

**How a race goes**

1. Tap "Tìm đối thủ". You get a random nickname such as "Ớt Hiểm 42" (tap "đổi tên" to reroll), with no account.
2. The server pairs the first two players waiting and picks one dish for both, plus a shared hazard seed. Both players get the same chilies, dough sticks and long noodles, in the same order and with the same gaps.
3. Both press "Bắt đầu húp". The mic opens and measures the room. When both are ready, both screens count down 3-2-1 together.
4. A row above your bowl shows the opponent's bowl draining live, about 10 updates a second, with their big moments ("Sặc!", "Hết hơi!").
5. When you finish, the result card slides up. If your opponent is still eating it shows "XONG! CHỜ…" with their clock ticking. Then the verdict stamps in ("THẮNG!", "THUA!" or "HÒA!") above a you-vs-them score with the winner highlighted. Buttons: "Đấu lại", "Tìm đối thủ mới" and "Đóng".
6. If your opponent leaves, a red banner drops in at the top with a warning beep, their row greys out with an "ĐÃ RỜI" tag, and the result card says you won because they left.

**When nobody is online:** after 6 seconds alone you race a recorded run of an earlier real player on the same dish and seed, labelled "Lượt ghi". If that dish has no recordings yet, you race a labelled bot ("Máy") at 1.6 times the dish's par time. Every finished race is saved as a future recording; the server keeps the last 20 per dish.

**Other rules**
- If your opponent leaves, you win by forfeit once you finish.
- The dish can't be changed during a duel: arrows, daily bowl, menu and "Múc tô mới" are locked until you finish or press "Rời trận".
- A duel time counts as your personal best for that dish, never as the daily bowl.

**Running it**
- Locally: `cd server`, `npm install`, `npm start`, then open `http://localhost:8080`. The server serves the game and the WebSocket (`/ws`) on the same port. It serves only `index.html` and `photos/`; nothing else in the folder is exposed.
- Hosting: any Node host with WebSockets, such as Render, Fly.io or Railway. Use start command `npm start` from `server/`; the port comes from `PORT`. HTTPS from the host is needed for the mic on phones.
- Page and server on different hosts: set `DUEL_SERVER` near the top of the 1v1 code in `index.html` to the server's `wss://…/ws` address.
- Recordings live in `server/runs.json` (git-ignored). On free hosts that reset, they refill as people play.

**Limits of this version**
- The server trusts the times players report, so a determined cheater could fake a win. Fine for a fun prototype; it needs server-side checks before any public leaderboard.
- Hazards come in the same order with the same gaps for both players, but their exact seconds can drift a little, because a hazard waits for the previous one to clear.
- Tested with two headless browsers and a fake microphone on one machine, not yet between two real phones over the internet.

## How it is built

The game itself is one `index.html` file with no libraries. Only 1v1 uses a backend: the Node.js server in `server/` (one dependency, `ws`).

- **Drawing:** inline SVG, generated from each dish's data (broth palette, noodle style, toppings, vessel).
- **Dishes:** a data table of 30 entries. A new dish is one line: colours, toppings, speeds and rule flags.
- **Slurp detection:** the mic's loudness between 1.5 and 8 kHz, compared with a noise floor measured for one second. No speech recognition, so accent does not matter. Saying "shhh" or blowing probably also counts.
- **Saved data:** best times, daily result and streak, in the browser's local storage on that device only.
- **Fonts:** Bungee for the sign and timer, Be Vietnam Pro for text.

**Known limits**

- The mic does not work on the page hosted in Claude, which blocks microphone access. It needs the file on an HTTPS host or localhost.
- Nothing is shared between players yet: no leaderboards, no challenge links.

**What has and has not been checked**

- Checked: the script parses; a simulated ideal run clears every dish in roughly 2 to 14 seconds; screenshots at rest of the bowl, the cup and the pot look right.
- Not checked: nobody has played it in a browser. Mic detection, the animations in motion, draining, and the balance of all 30 rules are untested.

## Next steps

- [ ] Play every dish once and tune the numbers that feel wrong
- [ ] Put `index.html` on an HTTPS host and test slurp detection on a real phone
- [x] Decide the 1v1 route: built the matchmaking server
- [ ] Host the 1v1 server and test a race between two real phones
- [ ] Add a slurp sound effect and the topping-by-topping milestones
- [ ] Give more dishes their own vessel, such as a plate for bún đậu
- [ ] Build challenge links and the city scoreboard once there is a backend
- [ ] Plan the launch: a Threads post and a few TikTok creators, timed before Tết 2027
