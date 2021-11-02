// ==UserScript==
// @name         MH: Halloween Brew Helper
// @namespace    https://greasyfork.org/en/users/831030-plasmoidia
// @version      0.1
// @description  Convenient buttons to help you instantly brew Evil Extract.
// @author       plasmoidia
// @match        https://www.mousehuntgame.com/camp.php
// @icon         https://www.google.com/s2/favicons?domain=mousehuntgame.com
// @grant        none
// ==/UserScript==

function getHudElement(className, cauldronNum, dataItemType) {
    let element = undefined;
    const search = document.getElementsByClassName(className);
    for (let i = 0; i < search.length; ++i) {
        if (search[i].attributes.getNamedItem('data-cauldron-index').value == cauldronNum) {
            if (dataItemType !== undefined) {
                if (search[i].attributes.getNamedItem('data-item-type').value == dataItemType) {
                    element = search[i];
                    break;
                }
            }
            else {
                element = search[i];
                break;
            }
        }
    }

    return element;
}

function getElementCauldron(cauldronNum, type) {
    return getHudElement('halloweenBoilingCauldronHUD-bait-cauldronButton', cauldronNum, type);
}

function getElementFinish(cauldronNum) {
    return getHudElement('halloweenBoilingCauldronHUD-cauldron-instantFinishButton', cauldronNum);
}

function createActionButton(text, className) {
    const btnTextSpan = document.createElement('span');
    btnTextSpan.innerText = text;
    const btn = document.createElement('button');
    btn.className = className;
    btn.style.cursor = 'pointer';
    btn.style.backgroundColor = 'orange';
    btn.style.fontSize = '9px';
    btn.style.border = '1px solid #ccc';
    btn.style.borderRadius = '3px';
    btn.style.padding = '1px 5px';
    btn.style.marginLeft = '-5px';
    btn.style.marginRight = '-5px';
    btn.style.textShadow = 'none';
    btn.style.display = 'inline-block';
    btn.appendChild(btnTextSpan);

    return btn;
}

function createButtons(cauldronNum) {
    let parent = undefined;
    let cauldronBox = document.getElementsByClassName('halloweenBoilingCauldronHUD-cauldron');
    for (let i = 0; i < cauldronBox.length; ++i) {
        if (cauldronBox[i].attributes.getNamedItem('data-cauldron-index').value == cauldronNum) {
            parent = cauldronBox[i];
        }
    }
    if (parent) {
        const container = document.createElement('div');
        container.className = 'halloweenBoilingCauldronHUD-cauldron-brewHelper plasmoidia-brewHelper';

        const brewSpan = document.createElement('span');
        brewSpan.className = 'plasmoidia-brewHelper plasmoidia-brewBtnSpan';
        const brewBtn = createActionButton('Brew EE', 'plasmoidia-brewHelper');
        brewSpan.appendChild(brewBtn);

        const elemBrewEE = getElementCauldron(cauldronNum, 'halloween_extract_stat_item');
        brewBtn.addEventListener('click', function() {
            var btn = $(brewBtn);
            btn.addClass('busy');
            hg.views.HeadsUpDisplayHalloweenBoilingCauldronView.brewRecipe(elemBrewEE, function() {
                btn.removeClass('busy');
            });
        });

        const finishSpan = document.createElement('span');
        finishSpan.className = 'plasmoidia-brewHelper plasmoidia-finishBtnSpan';
        const finishBtn = createActionButton('Use RR', 'plasmoidia-brewHelper');
        finishBtn.style.background = 'https://www.mousehuntgame.com/images/items/stats/transparent_thumb/ff427767e5a41f611bfc0350bc98e184.png?cv=2';
        finishSpan.appendChild(finishBtn);

        const elemFinish = getElementFinish(cauldronNum);
        finishBtn.addEventListener('click', function() {
            hg.views.HeadsUpDisplayHalloweenBoilingCauldronView.instantFinishBrew(elemFinish);
        });

        container.appendChild(brewSpan);
        container.appendChild(finishSpan);

        parent.appendChild(container);
    }
}

function renderBrewHelper() {
    'use strict';

    let brewHelpers = document.querySelectorAll('.plasmoidia-brewHelper');
    if (brewHelpers.length === 0) {
        createButtons(0);
        createButtons(1);
    }
}

$(document).ajaxStop(renderBrewHelper)
$(document).ready(renderBrewHelper)
