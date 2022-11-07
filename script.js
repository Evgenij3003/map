/*==========================================================================================================================================================================*/
/* Маршрут от статичной точки на карте до любой точки */
function initOnlineRoute() {
    let myMap = new ymaps.Map("map-online-route", {
        center: [59.91795236804815, 30.304908500000003],
        zoom: 15,
        controls: ["routePanelControl"]
    });


    let control = myMap.controls.get("routePanelControl");
    let city = "Витебск";


    // Первый способ (yandex.api):
    // let location = ymaps.geolocation.get();                                                  // Получение геолокации.
    // location.then(function(res) {
    // 	    let locationText = res.geoObjects.get(0).properties.get('text');
    // 	    console.log(locationText);
    // });


    // Второй способ (использование встроенного в браузер Geolocation Api):
    const options = {
        enableHighAccuracy: true,                                                               // Максимально точное определение местоположения.
        timeout: 5000,
        maximumAge: 0
    };


    function success(pos) {
        const crd = pos.coords;                                                                 // Получение объекта GeolocationCoordinates.                                                                    
        console.log(`Latitude : ${crd.latitude}`);                                              // Вывод: Latitude: 55.1926809 (широта).
        console.log(`Longitude: ${crd.longitude}`);                                             // Вывод: Longitude: 30.206359 (долгота).
        let reverseGeocoder = ymaps.geocode([crd.latitude, crd.longitude]);                     
        let locationText = null;
        reverseGeocoder.then(function(res) {
            locationText = res.geoObjects.get(0).properties.get("text");
            console.log(locationText);
            control.routePanel.state.set({                                                      // Данные для статичного маршрута на карте (Yandex-map).
                type: "masstransit",
                fromEnabled: false,
                from: locationText,
                toEnabled: true,
                to: `${city}, Кирова 2`,
            });
        });
        control.routePanel.options.set({                                                        // Настройки отображения панели управления маршрутами (Yandex-map).
            types: {
                auto: true,
                masstransit: true,                                                              // Автобус.
                pedestrian: true,                                                               // Человек.
                taxi: false,
                bicycle: false                                                                  // Велосипед.
            }
        })
    }


    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }


    navigator.geolocation.getCurrentPosition(success, error, options);                          // Функция определения геопозиции.
}
ymaps.ready(initOnlineRoute);