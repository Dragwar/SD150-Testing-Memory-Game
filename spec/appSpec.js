/*
  Exercise: Adding Jasmine to an existing project.
  Add Jasmine to your existing 'Memory Game' project
  Add a spec file that checks the following:

  - Ensures the game starts with 16 cards
  - Ensures that the cards all start closed
  - Ensures that the move counter starts at 0
  - Makes sure that after 2 cards are clicked, the move counter increases

*/
document.addEventListener('DOMContentLoaded', () => {
  describe('Cards', () => {
    it('should start with a total of 16 cards', () => {
      const allTheCards = document.querySelectorAll('.card');
      expect(allTheCards.length).toBe(16);

    });

    it('should start with all the cards to be closed', () => {
      const allTheOpenedCards = document.querySelectorAll('.open');
      expect(allTheOpenedCards.length).toBe(0);

    });
  });

  describe('Variables', () => {
    describe('MoveCounter', () => {
      it('should Start at zero moves', () => {
        const moveCounterEle = document.querySelector('span.moves');
        expect(moveCounter).toBe(0);
        expect(moveCounterEle.textContent).toBe('0');

      });

      it('should increase by one after two cards are clicked', () => {
        const cards = document.querySelectorAll('.card');
        const moveCounterEle = document.querySelector('span.moves');
        console.log('cards', cards);

        expect(cards.length).toBe(16);
        cards[1].click();
        cards[6].click();
        console.log('moveCounter', moveCounter);
        expect(moveCounterEle.textContent).toBe('1');

      });
    });

  });

});