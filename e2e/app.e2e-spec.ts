import { Angular2PCPartReviewTestPage } from './app.po';

describe('angular2-pcpart-review-test App', function() {
  let page: Angular2PCPartReviewTestPage;

  beforeEach(() => {
    page = new Angular2PCPartReviewTestPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
