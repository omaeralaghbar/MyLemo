(function () {

    var addCarForm = $('#addCarForm');
    var addCustomerForm = $('#addCustomerForm');
    var rentForm = $('#rentForm');
    var summaryForm = $('#summaryForm');
    var rentedForm = $('#rentedForm');
    var returnedForm = $('#returnForm');
    var receiptForm = $('#receiptForm');
    
    var cars = []; // array of cars to store car data
    var customers = []; // array of customers to store customer data
    var rents = []; // arry of rents made by customers
    var carsCopy = []; // another copy of cars array as the cars change after renting
    var receipt = []; // array receipt that will be shown to the customer
   
    // when the add Car button is pressed, get data form and store it in cars array
    $('#addCar').on('click', function (e) {
        // add car
        e.preventDefault();
        var type, model, year, km,carId;

        // getting car data
        type = $('#type').val();
        model = $('#txtModel').val();
        year = +$('#txtYear').val();
        km = +$('#txtKm').val();
        carId = cars.length;
        if (type != "" && model != "" && year > 0 && km > 0) {
            var i = {
                carId: carId,
                type: type,
                model: model,
                year: year,
                km: km
            }
            cars.push(i);
            carsCopy.push(i);
        document.getElementById('txtModel').value = "";
        document.getElementById('txtYear').value = "";
        document.getElementById('txtKm').value = "";
        alert("Car Added Successfully");
        } else {
            alert("Some missing fields");
        }
    });

    // when pressing next button to show next form (Customer Form)
    $('#btnNextCustomer').on('click', function (e) {
        //e.preventDefault();

        if (cars.length > 0) {
            addCarForm.hide();
            addCustomerForm.show();
        } else {
            alert("No Cars Added !");
        }

    });

    // when the add button is pressed, get data from and store it in customers array
    $('#addCustomer').on('click', function (e) {
        e.preventDefault();
        // add Customer
        var customerName, customerID, age, address, phone, licence;
        // getting customer data
        customerName = $('#txtCustomerName').val();
        customerID = +$('#txtCustomerID').val();
        age = +$('#txtAge').val();
        address = $('#txtAddress').val();
        phone = $('#txtPhone').val();
        licence = $('#txtlicence').val();

        if (customerName != "" && customerID != "" && age != "" && address != "" && phone != "" && licence != "") {
        var c = {
                customerName: customerName,
                customerID: customerID,
                age: age,
                address: address,
                phone: phone,
                licence: licence
            }
        customers.push(c)
        document.getElementById('txtCustomerName').value = "";
        document.getElementById('txtCustomerID').value = "";
        document.getElementById('txtAge').value = "";
        document.getElementById('txtAddress').value = "";
        document.getElementById('txtPhone').value = "";
        document.getElementById('txtlicence').value = "";
            alert("Customer Added Successfully !")
        } else {
            alert("Enter empty fields");
        }
    });

    // when pressing next button to show next form (Rent Form)
    $('#btnNextRent').on('click', function (e) {
        //e.preventDefault();
        if (customers.length > 0) {
            addCustomerForm.hide();
            rentForm.show();
            display();
        } else {
            alert("No Customer Added !");
        }
    });

    // when the submit button is pressed, get data from form and store it in rents array
    $('#addRent').on('click', function (e) {
        var selectedCustomer = document.getElementById("customer");
        if (selectedCustomer.length != 0) {
            var customer = selectedCustomer.options[selectedCustomer.selectedIndex].value;
            var selectedCar = document.getElementById("carType");
            if (selectedCar.length != 0) {
                var carId = selectedCar.value;
                var rentDays = document.getElementById("rentDays").value;
                var carStatus = document.getElementById("carStatus");
                var depositeAmount = document.getElementById("deposite").value;
                if (depositeAmount >= 500) {
                    if (rentDays >= 2) {
                        rentCarStatus = carStatus.options[carStatus.selectedIndex].text;

                        // get current date the add rentDays
                        var rentDate = new Date();
                        rentDate.setHours(18, 0, 0, 0);

                        var returnDate = new Date(rentDate.toString());
                        returnDate.setDate((rentDate.getDate() + Number(rentDays)));
                        returnDate.setHours(17, 0, 0, 0);

                        var returnDay = returnDate.getDay();
                        if (returnDay == 5) {
                            // it's friday,no return increase 3 days
                            returnDate.setDate((returnDate.getDate() + Number(3)));
                            rentDays = Number(rentDays) + 3;
                        } else if (returnDay == 6) {
                            // it's saturday,no return increase 2 days
                            returnDate.setDate((returnDate.getDate() + Number(2)));
                            rentDays = Number(rentDays) + 2;
                        } else if (returnDay == 0) {
                            // it's sunday, increase 1 days
                            returnDate.setDate((returnDate.getDate() + Number(1)));
                            rentDays = Number(rentDays) + 1;
                        } else {
                            // it's a normal day, no increment
                            returnDate.setDate((rentDate.getDate() + Number(rentDays)));
                        }
                        //alert(rentDate.toString()); // rent date
                        //alert(returnDate); // return date

                        //alert(rentDays); // number of days

                        var hoursRented = rentDays * 24 - 1; // number of hours rented
                        //alert(hoursRented);

                        // save rent
                        savingRents(customer, carId, rentCarStatus, rentDate, returnDate, rentDays, hoursRented, depositeAmount);
                        removeCar(carId); // when car is already rented remove from cars list
                        updateCarsDropList();
                        alert("rent saved successfully");
                        document.getElementById("rentDays").value = "";
                        document.getElementById("deposite").value = "";
                    } else {
                        alert("Rent days can not be less than 2")
                    }
                } else {
                    alert("deposite amaount can not be less than 500")
                }
            } else {
                alert("There is no cars");
            }
        } else {
            alert("There is no customers");
        }
    });

    // when (next) button is clicked to display the summary form
    $('#nextSummary').on('click', function (e) {
        if (rents.length > 0) {
            var lastRent = rents[rents.length - 1];
            var myrent = document.getElementById("rentReport");
            var rentTable = "";
            rentTable += "<table border='1' style='padding:10px'>";
            rentTable += "<tr>";
            rentTable += "<th>Customer</th>";
            rentTable += "<th>Car</th>";
            rentTable += "<th>Car Status</th>";
            rentTable += "<th>Rent Date</th>";
            rentTable += "<th>Return Date</th>";
            rentTable += "<th>Rent Days</th>";
            rentTable += "<th>Hours Rented</th>";
            rentTable += "<th>Deposite Amount</th>";
            rentTable += "</tr>";
            rentTable += "<tr>";
            var customer = lastRent.customer;
            var car;
            for (var i = 0; i < carsCopy.length; i++) {
                if (carsCopy[i].carId == lastRent.carId) {
                    car = carsCopy[i].type + ' - ' + carsCopy[i].model;
                    break;
                }
            }
            var carStatus = lastRent.rentCarStatus;
            var rentDate = lastRent.rentDate;
            var returnDate = lastRent.returnDate;
            var rentDays = lastRent.rentDays;
            var hoursRented = lastRent.hoursRented;
            var deposite = lastRent.depositeAmount;
            rentTable += "<td>" + customers[customer].customerName + "</td>";
            rentTable += "<td>" + car + "</td>";
            rentTable += "<td>" + carStatus + "</td>";
            rentTable += "<td>" + (new Date(rentDate)).toLocaleString(); + "</td>";
            rentTable += "<td>" + (new Date(returnDate)).toLocaleString(); + "</td>";
            rentTable += "<td>" + rentDays + "</td>";
            rentTable += "<td>" + hoursRented + "</td>";
            rentTable += "<td>" + deposite + "</td>";
            rentTable += "</tr>";
            rentTable += "</table>";
            myrent.innerHTML = rentTable;
            rentForm.hide();
            summaryForm.show();
        } else {
            alert("No Rent Found !");
        }
    });

    // when back button is pressed to return to Rent form
    $('#backToRent').on('click', function (e) {
        summaryForm.hide();
        rentForm.show();
    });

    $('#rentedSummary').on('click', function (e) {
        if(rents.length > 0){
            var myrent = document.getElementById("rentedReport");
            var rentTable = "";
            rentTable += "<table border='1' style='padding:10px'>";
            rentTable += "<tr>";
            rentTable += "<th>Customer</th>";
            rentTable += "<th>Car</th>";
            rentTable += "<th>Car Status</th>";
            rentTable += "<th>Rent Date</th>";
            rentTable += "<th>Return Date</th>";
            rentTable += "<th>Rent Days</th>";
            rentTable += "<th>Hours Rented</th>";
            rentTable += "<th>Deposite Amount</th>";
            rentTable += "</tr>";
            for (var i = 0; i < rents.length; i++) {
                var rent = rents[i];
                var customer = rent.customer;
                var car;
                for (var k = 0; k < carsCopy.length; k++) {
                    if (carsCopy[k].carId == rent.carId) {
                        car = carsCopy[k].type + ' - ' + carsCopy[k].model;
                        break;
                    }
                }
                var carStatus = rent.rentCarStatus;
                var rentDate = rent.rentDate;
                var returnDate = rent.returnDate;
                var rentDays = rent.rentDays;
                var hoursRented = rent.hoursRented;
                var deposite = rent.depositeAmount;
                rentTable += "<tr>";
                rentTable += "<td>" + customers[customer].customerName + "</td>";
                rentTable += "<td>" + car + "</td>";
                rentTable += "<td>" + carStatus + "</td>";
                rentTable += "<td>" + (new Date(rentDate)).toLocaleString(); + "</td>";
                rentTable += "<td>" + (new Date(returnDate)).toLocaleString(); + "</td>";
                rentTable += "<td>" + rentDays + "</td>";
                rentTable += "<td>" + hoursRented + "</td>";
                rentTable += "<td>" + deposite + "</td>";
                rentTable += "</tr>";
            }
            rentTable += "</table>";
            myrent.innerHTML = rentTable;
            rentedForm.show();
            rentForm.hide();
        }else {
            alert("No Rent Found !");
        }
    });

    // when back button is pressed to return to Rent form
    $('#backToRent2').on('click', function (e) {
        rentedForm.hide();
        rentForm.show();
    });
    
    // when (Return) button is clicked to display the Return form
    $('#return').on('click', function (e) {
        if (rents.length > 0) {
            rentForm.hide();
            returnedForm.show();
            // fill drop down lists with only rented customers
            var customerList = document.getElementById("returnCustomer");
            customerList.innerHTML = "";
            var oldStatus = document.getElementById("oldStatus");
            var car = document.getElementById("car");
            for (var i = 0; i < rents.length; i++) {
                var rent = rents[i];
                var displayedcustomers = customers[rent.customer];
                var option = document.createElement('option');
                option.text = displayedcustomers.customerName;
                option.value = i;
                customerList.add(option);
                oldStatus.value = rent.rentCarStatus;
                var carVal;
                for (var k = 0; k< carsCopy.length; k++) {
                    if (carsCopy[k].carId == rent.carId) {
                        carVal = carsCopy[k].type + ' - ' + carsCopy[k].model;
                        break;
                    }
                }
                car.value = carVal;
            }
        } else {
            alert("No Rent Found !");
        }
    });

    // when back button is pressed to return to Rent form
    $('#backToRent3').on('click', function (e) {
        returnedForm.hide();
        rentForm.show();
    });

    // when (Print Recipt) button is pressed
    $('#printReceipt').on('click', function (e) {
        var returnCustomer = document.getElementById("returnCustomer");
        if (returnCustomer.length != 0) {
            var c = returnCustomer.value;
            printReceipt(c);
            returnedForm.hide();
            receiptForm.show();
        } else {
            alert("There is no rented cars !");
        }
    });
    
    // when press (back) to return to Returned cars form
    $('#backToReturned').on('click', function (e) {
        receiptForm.hide();
        returnedForm.show();
    });

    // when a new customer is selected from the drop down list 
    $('#returnCustomer').on('change', function (e) {
        var customerList = document.getElementById("returnCustomer");
        var oldStatus = document.getElementById("oldStatus");
        var car = document.getElementById("car");

        var rent = rents[customerList.value];
        oldStatus.value = rent.rentCarStatus;
        var carVal;
        for (var i = 0; i < carsCopy.length; i++) {
            if (carsCopy[i].carId == rent.carId) {
                carVal = carsCopy[i].type + ' - ' + carsCopy[i].model;
                break;
            }
        }
        car.value = carVal;
    });
    $('#returnCustomer').on('select', function (e) {
        var customerList = document.getElementById("returnCustomer");
        var oldStatus = document.getElementById("oldStatus");
        var car = document.getElementById("car");

        var rent = rents[customerList.value];
        oldStatus.value = rent.rentCarStatus;
        var carVal;
        for (var i = 0; i < carsCopy.length; i++) {
            if (carsCopy[i].carId == rent.carId) {
                carVal = carsCopy[i].type + ' - ' + carsCopy[i].model;
                break;
            }
        }
        car.value = carVal;
    });

    // display customer, car drop lists
    function display() {
        var selectedCustomer = document.getElementById('customer');
        
        var selectedItems = document.getElementById('carType');
        // create to drop down list to select members and items
        var dropCustomer = "<select id = 'customerList'>";
        var dropCar = "<select id = 'carsList'>";
        for (var i = 0; i < customers.length; i++) {
            dropCustomer += ("<option value = '" + i + "'>" + customers[i].customerName + "</option>");
        }
        dropCustomer += "</select>";
        selectedCustomer.innerHTML += dropCustomer;

        for (var i = 0; i < cars.length; i++) {
            dropCar += ("<option value = '" + cars[i].carId + "'>" + cars[i].type + ' - ' + cars[i].model + ' - ' + cars[i].year + "</option>");
        }
        dropCar += "</select>";
        selectedItems.innerHTML = dropCar;
    }

    // save rent
    function savingRents(customer, carId, rentCarStatus, rentDate, returnDate, rentDays, hoursRented, depositeAmount) {
        function rent(customer, carId, rentCarStatus, rentDate, returnDate, rentDays, hoursRented, depositeAmount) {
            this.customer = customer;
            this.carId = carId;
            this.rentCarStatus = rentCarStatus;
            this.rentDate = rentDate;
            this.returnDate = returnDate;
            this.rentDays = rentDays;
            this.hoursRented = hoursRented;
            this.depositeAmount = depositeAmount;
        }
        var o = new rent(customer, carId, rentCarStatus, rentDate, returnDate, rentDays, hoursRented, depositeAmount);
        rents.push(o);
    }

    // already rented car will be removed from cars array
    function removeCar(carId) {
        var c = [];
        for (var i = 0; i < cars.length; i++) {
            if (cars[i].carId == carId)
                continue;
            c.push(cars[i]);
        }
        cars = c;
    }
    
    // cars list wil be updated after removing rented car
    function updateCarsDropList() {
        var selectedItems = document.getElementById('carType');
        // create to drop down list to select members and items
        var dropCar = "<select id = 'carsList'>";
        for (var i = 0; i < cars.length; i++) {
            dropCar += ("<option value = '" + cars[i].carId + "'>" + cars[i].type + ' - ' + cars[i].model + ' - ' + cars[i].year + "</option>");
        }
        dropCar += "</select>";
        selectedItems.innerHTML = dropCar;
    }

    // printing the receipt to the customer
    function printReceipt(customerVal) {
            var rent = rents[customerVal];
            var customer = customers[rent.customer];
            var car;
            for (var i = 0; i < carsCopy.length; i++) {
                if (carsCopy[i].carId == rent.carId) {
                    car = carsCopy[i].type + ' - ' + carsCopy[i].model;
                    break;
                }
            }
            //var car = rent.car;
            var oldStatus = rent.rentCarStatus;
            var rentDays = rent.rentDays;
            var rentHours = rent.hoursRented;
            var selectedStatus = document.getElementById("returnCarStatus");
            var currentStatus = selectedStatus.options[selectedStatus.selectedIndex].text;
            var statusValue = document.getElementById("oldStatus").value;
            var rentDate = rent.rentDate;
            var returnDate = rent.returnDate;
            var currentDate = new Date();

            var newDays;
            var timeDiff = (currentDate.getTime() + (30 * 60 * 1000) - (new Date(rentDate)).getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            var diffHours = Math.floor(timeDiff / (1000 * 3600));

            if (diffHours > rentHours) {
                newDays = diffDays; // all days car kept with the customer (exceeds limit)
            } else {
                newDays = rentDays; // in time
            }
            var penalty = (newDays - rentDays) * 1.5;
            totalDaysCharged = penalty + Number(rentDays);

            // check status
            var statusCost;
            if (currentStatus == oldStatus) {
                statusCost = 0;
            } else {
                statusCost = selectedStatus.value;
            }
            var myreciept = document.getElementById("reciept");
            var recieptTable = "";

            recieptTable += "<table border='1' style='padding:20px;width:100%'>";
            recieptTable += "<tr><th>Element</th><th>Details</th></tr>";
            recieptTable += "<tr><td><b>Name</b></td><td>" + customer.customerName + "</td></tr>";
            recieptTable += "<tr><td><b>Car</b></td><td>" + car + "</td></tr>";
            recieptTable += "<tr><td><b>Rent Date</b></td><td>" + new Date(rentDate).toLocaleString() + "</td></tr>";
            recieptTable += "<tr><td><b>Return Date</b></td><td>" + new Date(returnDate).toLocaleString() + "</td></tr>";
            recieptTable += "<tr><td><b>Current Date</b></td><td>" + new Date(currentDate).toLocaleString() + "</td></tr>";
            recieptTable += "<tr><td><b>Rent Days</b></td><td>" + rentDays + "</td></tr>";
            recieptTable += "<tr><td><b>Penality</b></td><td>" + penalty + "</td></tr>";
            recieptTable += "<tr><td><b>Total Days</b></td><td>" + totalDaysCharged + "</td></tr>";
            recieptTable += "<tr><td><b>Old Status</b></td><td>" + oldStatus + "</td></tr>";
            recieptTable += "<tr><td><b>Current Status</b></td><td>" + currentStatus + "</td></tr>";
            recieptTable += "<tr><td><b>Status Cost</b></td><td>" + statusCost + "</td></tr>";
            recieptTable += "</table>";
            myreciept.innerHTML = recieptTable;
    }
})();