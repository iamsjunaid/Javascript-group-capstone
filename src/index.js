// index.js
import './index.css';
import getMeals from './modules/getMeals.js';
import openPopup from './modules/popUp.js';
import reservationsPopUp from './modules/reservationsPopUp.js';
import addNewReservationsPopUp from './modules/addReservation.js';
import { getLikes } from './modules/getLikes.js';

const mealsSection = document.querySelector('.meals-section');
const parser = new DOMParser();

const init = async () => {
  const likesArray = await getLikes();
  const mealsArray = await getMeals();

  const combinedArray = mealsArray.meals.map((meal) => {
    const likeForThisMeal = likesArray.filter((likeObj) => likeObj.item_id === meal.idMeal);
    return {
      strMealThumb: meal.strMealThumb,
      strMeal: meal.strMeal,
      idMeal: meal.idMeal,
      likes: likeForThisMeal.length === 0 ? 0 : likeForThisMeal[0].likes,
    };
  });

  combinedArray.forEach((mealWithLike) => {
    const string = `
      <div class="meal-container">
      <img src="${mealWithLike.strMealThumb}" alt="meal" class="meal-img">
        
        <div class="meal-details">
          <div class="meal-desc">
          <p class="title">${mealWithLike.strMeal}</p>
          <div class="like" id="${mealWithLike.idMeal}">
            <p class='likes'>${mealWithLike.likes}</p>
            <i class="fa-solid fa-heart like-btn"></i>
          </div>
          <button type="button" class="comment-btn">Comments</button>
          <button type="button" class="reservations-btn">Reservations</button>
          <button type="button" class="new-reservations-btn">Add new reservation</button>
        </div>
      </div>`;
    const stringElement = parser.parseFromString(string, 'text/html').body
      .firstChild;
    mealsSection.append(stringElement);

    const newReservationsBtn = stringElement.querySelector('.new-reservations-btn');
    newReservationsBtn.addEventListener('click', () => {
      addNewReservationsPopUp(mealWithLike);
    });

    const reservationsBtn = stringElement.querySelector('.reservations-btn');
    reservationsBtn.addEventListener('click', () => {
      reservationsPopUp(mealWithLike);
    });

    // Get the comment button element
    const commentBtn = stringElement.querySelector('.comment-btn');
    // Add event listener to the comment button
    commentBtn.addEventListener('click', () => {
      openPopup(mealWithLike);
    });
  });
};

init();