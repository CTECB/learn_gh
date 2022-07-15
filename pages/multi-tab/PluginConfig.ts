import BasePage from '@pages/common/BasePage';
import { SystemPluginSettingPage } from '@pages/common/SystemPluginSetting';
import { actionUtil } from '@utils/ActionUtil';
import { elementUtil } from '@utils/ElementUtil';
import { sprintf } from 'sprintf-js';

const PLUGIN_VERSION = '.gaia-admin-app-plugin-config-version';
const START_TAB_DDL = '//div[@class="table-tab-row"][%d]/div[@class="table-tab-left"]/div[1]//div[@class="kuc-dropdown-sub-container"]';
const START_SELECTED_TAB_ITEM = `${START_TAB_DDL}//div[@class="kuc-dropdown-selected"]//span[@class="kuc-dropdown-selected-label"]`;
const START_TAB_ITEM = `${START_TAB_DDL}//div[@class="kuc-list-outer"]//*[@class="kuc-list-item-label" and contains(text(), "%s")]`;
const START_TAB_ITEMS = `${START_TAB_DDL}//div[@class="kuc-list-outer"]//div[contains(@class,"kuc-list-item")]//span[@class="kuc-list-item-label"]`;
const END_TAB_DDL = '//div[@class="table-tab-row"][%d]/div[@class="table-tab-left"]/div[2]//div[@class="kuc-dropdown-sub-container"]';
const END_SELECTED_TAB_ITEM = `${END_TAB_DDL}//div[@class="kuc-dropdown-selected"]//span[@class="kuc-dropdown-selected-label"]`;
const END_TAB_ITEM = `${END_TAB_DDL}//div[@class="kuc-list-outer"]//*[@class="kuc-list-item-label" and contains(text(), "%s")]`;
const END_TAB_ITEMS = `${END_TAB_DDL}//div[@class="kuc-list-outer"]//div[contains(@class,"kuc-list-item")]//span[@class="kuc-list-item-label"]`;
const TAB_SELECTION_TABLE = '//div[@class="table-tab-row"][%d]/div[@class="table-tab-right"]//div[@class="kuc-table-tbody"]';
const TAB_SELECTION_LIST = `${TAB_SELECTION_TABLE}//div[@class="kuc-table-tr"]`;
const LAST_SELECTED_TAB_CBX = '//div[@class="table-tab-row"][1]/div[@class="table-tab-left"]//div[@class="kuc-input-checkbox"]//input[@type="checkbox"]';
const ENABLE_TAB_CBX = `${TAB_SELECTION_LIST}[%d]//input[@type="checkbox"]`;
const DEFAULT_TAB_RAD = `${TAB_SELECTION_LIST}[%d]//input[@type="radio"]`;
const ADD_SECTION_ICN = '.table-tab-add';
const SUBMIT_BTN = '.plugin-layout .button-group__save';

class PluginConfig extends BasePage {
  public async selectStartTabItem(section: number, itemLabel: string) {
    const dropdownSelector = sprintf(START_TAB_DDL, section);
    const dropdownItemSelector = sprintf(START_TAB_ITEM, section, itemLabel);
    await $(dropdownSelector).click();
    await $(dropdownItemSelector).waitForEnabled();
    await $(dropdownItemSelector).click();
  }

  public async getStartTabItems(section: number) {
    await $(sprintf(START_TAB_DDL, section)).click();
    const itemList = await $$(sprintf(START_TAB_ITEMS, section));
    const blankSpaceItems: any = [];
    for (let i = 0; i < itemList.length; i++) {
      const blankSpace = await itemList[i].getText();
      blankSpaceItems.push(blankSpace);
    }
    await $(sprintf(START_TAB_DDL, section)).click();
    return blankSpaceItems;
  }

  public async selectEndTabItem(section: number, itemLabel: string) {
    const dropdownSelector = sprintf(END_TAB_DDL, section);
    const dropdownItemSelector = sprintf(END_TAB_ITEM, section, itemLabel);
    const tabSelectionTableSelector = sprintf(TAB_SELECTION_TABLE, section);
    await $(dropdownSelector).click();
    await $(dropdownItemSelector).waitForEnabled();
    await $(dropdownItemSelector).click();
    await $(tabSelectionTableSelector).waitForDisplayed();
  }

  public async getEndTabItems(section: number) {
    await $(sprintf(END_TAB_DDL, section)).click();
    const itemList = await $$(sprintf(END_TAB_ITEMS, section));
    const blankSpaceItems: any = [];
    for (let i = 0; i < itemList.length; i++) {
      const blankSpace = await itemList[i].getText();
      blankSpaceItems.push(blankSpace);
    }
    await $(sprintf(END_TAB_DDL, section)).click();
    return blankSpaceItems;
  }

  public async clickAddSectionIcon() {
    await $(ADD_SECTION_ICN).click();
  }

  public async setEnableTabs(section: number, indexArr: number[], isChecked: boolean) {
    for (const index of indexArr) {
      const selector = sprintf(ENABLE_TAB_CBX, section, index);
      if (await $(selector).isSelected() !== isChecked) {
        await actionUtil.clickElementByJS(selector);
        await browser.pause(1000);
      }
    }
  }

  public async setLastSelectedTab(section: number, isChecked: boolean) {
      const selector = sprintf(LAST_SELECTED_TAB_CBX, section);
      if (await $(selector).isSelected() !== isChecked) {
        await actionUtil.clickElementByJS(selector);
        await browser.pause(1000);
    }
  }

  public async setDefaultTabs(section: number, index: number) {
    const selector = sprintf(DEFAULT_TAB_RAD, section, index);
    await $(selector).waitForEnabled();
    await actionUtil.clickElementByJS(selector);
  }

  public async clickSubmit() {
    await $(SUBMIT_BTN).click();
    await SystemPluginSettingPage.elmNotificationDlg.waitForDisplayed();
  }

  public async verifyPluginVersion(version: string) {
    await expect($(PLUGIN_VERSION)).toHaveText(version);
  }

  public async verifyStartTab(section: number, selectedTabName: string) {
    const selectedStartTab = await $(sprintf(START_SELECTED_TAB_ITEM, section));
    await expect(selectedStartTab).toHaveText(selectedTabName);
  }

  public async verifyEndTab(section: number, selectedTabName: string) {
    const selectedEndTab = await $(sprintf(END_SELECTED_TAB_ITEM, section));
    await expect(selectedEndTab).toHaveText(selectedTabName);
  }

  public async verifyTabSelectionList(section: number, expectedTabInfo: any) {
    const tabSelectionListElm = await $$(sprintf(TAB_SELECTION_LIST, section));

    const tabInfoList: [{ isEnabled: boolean; isDefault: boolean; blankSpaceId: string; tabName: string }] | any = [];
    for (let i = 0; i < tabSelectionListElm.length; i++) {
      // @ts-ignore
      const itemIndex = tabSelectionListElm[i].index + 1;
      const itemSelector = tabSelectionListElm[i].selector;

      const isEnabledSelector = `${itemSelector}[${itemIndex}]//div[1]//input`;
      const isDefaultSelector = `${itemSelector}[${itemIndex}]//div[2]//input`;
      const blankSpaceIdSelector = `${itemSelector}[${itemIndex}]//div[3]`;
      const tabNameSelector = `${itemSelector}[${itemIndex}]//div[4]/input`;
      const isEnabled = await $(isEnabledSelector).isSelected();
      const isDefault = await $(isDefaultSelector).isSelected();
      const blankSpaceId = await $(blankSpaceIdSelector).getText();
      const tabName = await elementUtil.getTextFieldValue(tabNameSelector);
      tabInfoList.push({ isEnabled: isEnabled, isDefault: isDefault, blankSpaceId: blankSpaceId, tabName: tabName });
    }
    await expect(tabInfoList).toEqual(expectedTabInfo);
  }
}

export const PluginConfigPage = new PluginConfig();
