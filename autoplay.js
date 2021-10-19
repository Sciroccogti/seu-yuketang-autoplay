// ==UserScript==
// @name        雨课堂看课（改）
// @namespace   http://tampermonkey.net/
// @version     0.4.1
// @description 雨课堂自动看课，不支持做作业，修改自：https://greasyfork.org/scripts/415916
// @homepage    https://github.com/Sciroccogti/seu-yuketang-autoplay
// @author      pboymt,Sciroccogti
// @match       https://*.yuketang.cn/pro/lms/*
// @grant       window.onurlchange
// ==/UserScript==



(function() {
    'use strict';

    // Your code here...

    let interval = null;

    function speed(){
        console.log("准备Robot-开启2.0倍速");
        const video = document.querySelector("video");
        video.playbackRate = 2.0;
        document.querySelector(".xt_video_player_speed").click();
        var speed = document.querySelector(".xt_video_player_common_list");
        var speedChild = speed.firstChild;
        speedChild.click();
        console.log("Robot-开启2.0倍速");
    }

    function openNext() {
        var url = window.location.href;
        var newVideoId = parseInt(/video\/([0-9]+)$/.exec(url)[1]) + 1;
        var newUrl = url.replace(/video\/[0-9]+$/,"video/" + newVideoId);
        window.location.replace(newUrl);
    }

    function wait() {
        var url = window.location.href;
        if (document.querySelector(".title-fl") == null || document.querySelector(".title-fl").firstChild.firstChild.data == "") {
            // 标题还未加载出
            setTimeout(wait, 500);
        } else if (document.querySelector(".title-fl").firstChild.firstChild.data != "Video" && /video\/[0-9]+$/.test(url)) {
            // 链接有 Video，但标题不是 Video，则是脚本走错了 url，直接跳转到下一个
            console.log("title is" + document.querySelector(".title-fl").firstChild.firstChild.data);
            openNext();
            return false;
        } else if (document.querySelector("video") == null){
            setTimeout(wait, 500);
            return false;
        } else {
            console.log("自动开始");
            document.querySelector("video").play(); // 播放视频
            return true;
        }
    }

    function main(url) {
        wait();
        if (/studycontent$/.test(url)) {
            const container = document.querySelector(".viewContainer");
            const leaves = document.querySelectorAll(".leaf-detail");
            console.log(leaves);
            for (let i = 0; i < leaves.length; i++) {
                const leaf = leaves.item(i);
                const is_shipin = leaf.querySelector(".icon--shipin");
                if (is_shipin) {
                    //                     console.log(leaf);
                    const time = leaf.querySelector(".progress-time .progress-wrap .item");
                    if(time.textContent.trim() !== "已完成") {
                        time.scrollIntoView();
                        container.scrollBy(0, -200);
                        console.log(time);
                        setTimeout(() => {
                            time.click();
                        }, 500);
                        break;
                    }
                }
            }
        }
        if (/video\/[0-9]+$/.test(url)) {
            interval = setInterval(() => {
                const video = document.querySelector("video");
                if (document.querySelector(".icon--gou") !== null) {
                    console.log("完成度100%");
                    // document.querySelector(".btn-next").click();
                    // clearInterval(interval);
                    // 按钮点击似乎已经失效
                    // 直接跳转下一个视频（id+1）
                    openNext(url);
                } else {
                    video.play();
                    console.log("继续监测视频是否结束");
                }
            },1000);
        }
    }


    console.log("雨课堂");
    const user_wrapper = document.querySelector(".user-wrapper");
    const btn = document.createElement("div");
    btn.classList.add("downloadbtn");
    const btn_icon = document.createElement("div");
    btn_icon.classList.add("el-badge", "item");
    const btn_icon_i = document.createElement("i");
    btn_icon_i.classList.add("icon--bofang1", "iconfont");
    btn_icon.appendChild(btn_icon_i);
    btn.appendChild(btn_icon);
    user_wrapper.prepend(btn);
    btn.addEventListener("click", () => {
        main(window.location.href);
    });
    main(window.location.href)
    console.log(window.onurlchange);
    if (window.onurlchange === null) {
        window.addEventListener("urlchange", (info) => {
            console.log(info);
            setTimeout(() => {
                main(info.url);
            }, 2000);
        });
    }

})();
