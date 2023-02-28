var departmentID = 0;
var locationID = 0;
var locations = [];
var allDepartments = [];

// Success Toast

const successToastContent = $(".toastSuccess");
const successToast = new bootstrap.Toast(successToastContent);

// Deletion toast

const dangerToastContent = $(".toastDanger");
const dangerToast = new bootstrap.Toast(dangerToastContent);

// Information toast

const infoToastContent = $(".toastInfo");
const infoToast = new bootstrap.Toast(infoToastContent);

// Confirmation Toast

const deptConfirm = new bootstrap.Toast($(".deptConfirm"));
const userConfirm = new bootstrap.Toast($(".userConfirm"));
const locConfirm = new bootstrap.Toast($(".locConfirm"));

// Update Confirmation

const updateToastContent = $(".toastUpdate");
const updateToast = new bootstrap.Toast(updateToastContent);

// -----------------------------GET ALL PERSONNEL--------------------------------------------

const getAllPersonnel = () => {
  $.ajax({
    url: "libs/php/getAll.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      $(".employee-dtl tbody").empty();
      $(".emp-container").show();
      result.data.forEach((employee) => {
        $(".employee-dtl tbody").append(`
        <tr>       
        <td class="emp" data-id=${employee.id}>${employee.firstName}</td>
        <td class="lastname">${employee.lastName}</td>
        <td class="department_row" data-deptid=${employee.departmentID}>${employee.department}</td>
        <td class="location_row" data-locid=${employee.locationID}>${employee.location}</td>
        <td>${employee.email}</td>
        <td><i class="fa-solid fa-trash delete-user"></i></td>
        <td><i class="fa-solid fa-pen-to-square edit-user"></i></td>
      </tr>
                `);
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // your error code
      console.log(textStatus);
      console.log(errorThrown);
      console.log(jqXHR);
    },
  });
};

// ------------------------------GET ALL LOCATION----------------------

const getAllLocation = () => {
  $.ajax({
    url: "libs/php/getAllLocation.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      $(".loc-dtl").empty();
      $(".loc-dtl").append(`   <thead class="thead-dark">
            <tr>
            <th>Location</th>
            <th >Delete</th>
          <th >Edit</th>
          </tr>
        </thead>`);

      locations = result.data.map((item) => item.name);
      result.data.forEach((location) => {
        $(".loc-dtl").append(` <tbody> <tr>       
                <td class="location-r" data-id=${location.id}>${location.name}</td>
                <td><i class="fa-solid fa-trash delete-loc"></i></td>
                <td><i class="fa-solid fa-pen-to-square edit-loc"></i></td>
              </tr></tbody>
                  `);
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // your error code
      console.log(textStatus);
      console.log(errorThrown);
      console.log(jqXHR);
    },
  });
  $.ajax({
    url: "libs/php/getAllLocation.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      result.data.sort((a, b) => a.name.localeCompare(b.name));

      result.data.forEach((location) => {
        $(".location")
          .append(`<option class="locationVal" value=${location.id}>${location.name}</option>
                `);
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // your error code
      console.log(textStatus);
      console.log(errorThrown);
      console.log(jqXHR);
    },
  });
};

// -----------------------GET ALL DEPARTMENTS-----------------------------------------

const getAllDepartments = () => {
  $.ajax({
    url: "libs/php/getAllDepartments.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      $(".dept-dtl").empty();
      $(".dept-dtl").append(`   <thead class="thead-dark">
        <tr>
        <th>Department</th>
        <th>Location</th>
        <th >Delete</th>
          <th >Edit</th>
      </tr>
    </thead>`);
      allDepartments = result.data.map((item) => item.department);
      result.data.map((department) => {
        $(".dept-dtl").append(` <tbody> <tr>       
                <td class="deptt" data-depttid=${department.departmentID}>${department.department}</td>
                <td class="locc" data-locid=${department.locationID}>${department.location}</td>
                <td><i class="fa-solid fa-trash delete-dept"></i></td>
                <td><i class="fa-solid fa-pen-to-square edit-dept"></i></td>
              </tr></tbody>
                  `);
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // your error code
      console.log(textStatus);
      console.log(errorThrown);
      console.log(jqXHR);
    },
  });
  $.ajax({
    url: "libs/php/getAllDepartments.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      //   result.data.sort((a, b) => a.name.localeCompare(b.name));
      result.data.map((department) => {
        $(".dept")
          .append(` <option id="department-val" value=${department.departmentID}>${department.department}</option>
                `);
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // your error code
      console.log(textStatus);
      console.log(errorThrown);
      console.log(jqXHR);
    },
  });
};

// ------------------------------------Get PersonnelBYDepartment---------------------------------

const getPersonnelByDepartment = (deptID) => {
  $.ajax({
    url: "libs/php/getPersonnelByDepartment.php",
    type: "GET",
    dataType: "json",
    async: false,
    data: {
      id: deptID,
    },
    success: function (result) {
      department = result;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // your error code
      console.log(textStatus);
      console.log(errorThrown);
      console.log(jqXHR);
    },
  });
  return department;
};

// --------------------------------------------GET PERSONNEL BY LOCATION----------------------------------

const getPersonnelByLocation = (locID) => {
  $.ajax({
    url: "libs/php/getLocationByID.php",
    type: "GET",
    dataType: "json",
    async: false,
    data: {
      id: locID,
    },
    success: function (result) {
      locationResult = result;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // your error code
      console.log(textStatus);
      console.log(errorThrown);
      console.log(jqXHR);
    },
  });

  return locationResult;
};

// ---------------------------------Document Ready---------------------------------

$(document).ready(() => {
  getAllPersonnel();
  getAllDepartments();
  getAllLocation();
  $(".dep-container").hide();
  $(".loc-container").hide();
});

// ----------------------------------Radiobutton selection-----------------------------

$(document).change(() => {
  if ($(".emp-btn").is(":checked")) {
    $(".dep-container").hide();
    $(".loc-container").hide();
    $(".emp-container").show();
  }
  if ($(".dept-btn").is(":checked")) {
    $(".emp-container").hide();
    $(".loc-container").hide();
    $(".dep-container").show();
  }

  if ($(".loc-btn").is(":checked")) {
    $(".emp-container").hide();
    $(".dep-container").hide();
    $(".loc-container").show();
  }
});

// --------------------------Drop down selection----------------------------------

$("body").on("change", "#department", function (e) {
  e.preventDefault();
  departmentID = $("#department :selected").val();
  department = $("#department :selected").text();
});

$("body").on("change", "#location", function (e) {
  e.preventDefault();
  locationID = $(".location :selected").val();
  place = $("#location :selected").text();
});

// --------------------------------Search-----------------------------------------
$("body").on("click", ".search-btn", function (e) {
  $(".emp-btn").attr("checked", true);
  $(".emp-container").show();
  $(".dep-container").hide();
  $(".loc-container").hide();
  let firstName = $("#name-search").val();
  if (!firstName && locationID < 1 && departmentID < 1) {
    getAllPersonnel();
  }
  //   search with firstname
  if (firstName && locationID < 1 && departmentID < 1) {
    $.ajax({
      url: "libs/php/getPersonnelByName.php",
      type: "GET",
      dataType: "json",
      data: {
        name: firstName + "%",
      },
      success: function (result) {
        if (result.data.length == 0) {
          $(".employee-dtl tbody").empty();

          $(".toast-info .toast-body h5").html(`NO RECORD FOUND!!`);
          infoToast.show();
        } else {
          $(".employee-dtl tbody").empty();
          $(".emp-container").show();
          result.data.forEach((employee) => {
            $(".employee-dtl tbody").append(`
            <tr>
            <td class="emp" data-id=${employee.id}>${employee.firstName}</td>
            <td class="lastname">${employee.lastName}</td>
            <td class="department_row" data-deptid=${employee.departmentID}>${employee.name}</td>
            <td class="location_row" data-locid=${employee.locationID}>${employee.location}</td>
            <td>${employee.email}</td>
            <td><i class="fa-solid fa-trash delete-user"></i></td>
            <td><i class="fa-solid fa-pen-to-square edit-user"></i></td>
          </tr>
                    `);
          });
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // your error code
        console.log(textStatus);
        console.log(errorThrown);
        console.log(jqXHR);
      },
    });
  }
  //   search with location
  if (!firstName && locationID > 0 && departmentID < 1) {
    $.ajax({
      url: "libs/php/getPersonnelByLocation.php",
      type: "GET",
      dataType: "json",
      data: {
        id: locationID,
      },
      success: function (result) {
        if (result.data.length == 0) {
          console.log("with loc");
          $(".employee-dtl tbody").empty();
          $(".toast-info .toast-body").html(`NO RECORD FOUND!!`);
          infoToast.show();
        } else {
          $(".employee-dtl tbody").empty();
          $(".emp-container").show();
          result.data.forEach((employee) => {
            $(".employee-dtl tbody").append(`
              <tr>
              <td class="emp" data-id=${employee.id}>${employee.firstName}</td>
              <td class="lastname">${employee.lastName}</td>
              <td class="department_row" data-deptid=${employee.departmentID}>${employee.name}</td>
              <td class="location_row" data-locid=${employee.locationID}>${employee.location}</td>
              <td>${employee.email}</td>
              <td><i class="fa-solid fa-trash delete-user"></i></td>
            <td><i class="fa-solid fa-pen-to-square edit-user"></i></td>
            </tr>
                      `);
          });
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // your error code
        console.log(textStatus);
        console.log(errorThrown);
        console.log(jqXHR);
      },
    });
  }
  // Search with department
  if (!firstName && locationID < 1 && departmentID > 0) {
    $.ajax({
      url: "libs/php/getPersonnelByDepartment.php",
      type: "GET",
      dataType: "json",
      data: {
        id: departmentID,
      },
      success: function (result) {
        if (result.data.length == 0) {
         
          $(".employee-dtl tbody").empty();
          $(".toast-info .toast-body").html(`NO RECORD FOUND!!`);
          infoToast.show();
        } else {
          $(".employee-dtl tbody").empty();
          $(".emp-container").show();
          result.data.forEach((employee) => {
            $(".employee-dtl tbody").append(`
            <tr>
            <td class="emp" data-id=${employee.id}>${employee.firstName}</td>
            <td class="lastname">${employee.lastName}</td>
            <td class="department_row" data-deptid=${employee.departmentID}>${employee.name}</td>
            <td class="location_row" data-locid=${employee.locationID}>${employee.location}</td>
            <td>${employee.email}</td>
            <td><i class="fa-solid fa-trash delete-user"></i></td>
            <td><i class="fa-solid fa-pen-to-square edit-user"></i></td>
          </tr>
                    `);
          });
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // your error code
        console.log(textStatus);
        console.log(errorThrown);
        console.log(jqXHR);
      },
    });
  }
  //   Search with firstname and location
  if (firstName && locationID > 0 && departmentID < 1) {
    $.ajax({
      url: "libs/php/getPersByNameLoc.php",
      type: "GET",
      dataType: "json",
      data: {
        id: locationID,
        name: firstName + "%",
      },
      success: function (result) {
        if (result.data.length > 0) {
          $(".employee-dtl tbody").empty();
          $(".emp-container").show();
          result.data.forEach((employee) => {
            $(".employee-dtl tbody").append(`
             <tr>
            <td class="emp" data-id=${employee.id}>${employee.firstName}</td>
            <td class="lastname">${employee.lastName}</td>
            <td class="department_row" data-deptid=${employee.departmentID}>${employee.department}</td>
            <td class="location_row" data-locid=${employee.locationID}>${employee.location}</td>
            <td>${employee.email}</td>
            <td><i class="fa-solid fa-trash delete-user"></i></td>
            <td><i class="fa-solid fa-pen-to-square edit-user"></i></td>
          </tr>
                    `);
          });
        } else {
          $(".employee-dtl tbody").empty();
          $(".toast-info .toast-body").html(`NO RECORD FOUND!!`);
          infoToast.show();
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // your error code
        console.log(textStatus);
        console.log(errorThrown);
        console.log(jqXHR);
      },
    });
  }
  //     Search with firstname and department
  if (firstName && locationID < 1 && departmentID > 0) {
    $.ajax({
      url: "libs/php/getPersByNameDep.php",
      type: "GET",
      dataType: "json",
      data: {
        id: departmentID,
        name: firstName + "%",
      },
      success: function (result) {
        if (result.data.length > 0) {
          $(".employee-dtl tbody").empty();
          $(".emp-container").show();
          result.data.forEach((employee) => {
            $(".employee-dtl tbody").append(`
          <tr>
          <td class="emp" data-id=${employee.id}>${employee.firstName}</td>
          <td class="lastname">${employee.lastName}</td>
          <td class="department_row" data-deptid=${employee.departmentID}>${employee.department}</td>
          <td class="location_row" data-locid=${employee.locationID}>${employee.location}</td>
          <td>${employee.email}</td>
          <td><i class="fa-solid fa-trash delete-user"></i></td>
          <td><i class="fa-solid fa-pen-to-square edit-user"></i></td>
        </tr>
                  `);
          });
        } else {
          $(".employee-dtl tbody").empty();
          $(".toast-info .toast-body").html(`NO RECORD FOUND!!`);
          infoToast.show();
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // your error code
        console.log(textStatus);
        console.log(errorThrown);
        console.log(jqXHR);
      },
    });
  }

  //   Search with location and department
  if (!firstName && locationID > 0 && departmentID > 0) {
    $.ajax({
      url: "libs/php/getPersByDepLoc.php",
      type: "GET",
      dataType: "json",
      data: {
        departmentID: departmentID,
        locationID: locationID,
      },
      success: function (result) {
        if (result.data.length > 0) {
          $(".employee-dtl tbody").empty();
          $(".emp-container").show();
          result.data.forEach((employee) => {
            $(".employee-dtl tbody").append(`
          <tr>
          <td class="emp" data-id=${employee.id}>${employee.firstName}</td>
          <td class="lastname">${employee.lastName}</td>
          <td class="department_row" data-deptid=${employee.departmentID}>${employee.department}</td>
          <td class="location_row" data-locid=${employee.locationID}>${employee.location}</td>
          <td>${employee.email}</td>
          <td><i class="fa-solid fa-trash delete-user"></i></td>
            <td><i class="fa-solid fa-pen-to-square edit-user"></i></td>
        </tr>
                  `);
          });
        } else {
          $(".employee-dtl tbody").empty();
          $(".toast-info .toast-body").html(`NO RECORD FOUND!!`);
          infoToast.show();
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // your error code
        console.log(textStatus);
        console.log(errorThrown);
        console.log(jqXHR);
      },
    });
  }
  //   Search with firstname,departmentand location
  if (firstName && locationID > 0 && departmentID > 0) {
    $.ajax({
      url: "libs/php/getPersonnelBySearch.php",
      type: "GET",
      dataType: "json",
      data: {
        depID: departmentID,
        name: firstName + "%",
        locID: locationID,
      },
      success: function (result) {
        if (result.data.length > 0) {
          $(".employee-dtl tbody").empty();

          $(".emp-container").show();
          result.data.forEach((employee) => {
            $(".employee-dtl tbody").append(`
             <tr>
              <td class="emp" data-id=${employee.id}>${employee.firstName}</td>
              <td class="lastname">${employee.lastName}</td>
              <td class="department_row" data-deptid=${employee.departmentID}>${employee.department}</td>
              <td class="location_row" data-locid=${employee.locationID}>${employee.location}</td>
              <td>${employee.email}</td>
              <td><i class="fa-solid fa-trash delete-user"></i></td>
            <td><i class="fa-solid fa-pen-to-square edit-user"></i></td>
            </tr>
                      `);
          });
        } else {
          $(".employee-dtl tbody").empty();
          $(".toast-info .toast-body").html(`NO RECORD FOUND!!`);
          infoToast.show();
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // your error code
        console.log(textStatus);
        console.log(errorThrown);
        console.log(jqXHR);
      },
    });
  }
});

// ------------------------------------------------Department----------------------------------------------------------

// --------------------------------Add Department------------------------------

$(".add-dept")
  .unbind()
  .click(() => {
    $("#addDept #dept-new").val("");
    $("#addDept").modal("show");
    $(".addDept-btn")
      .unbind()
      .click(() => {
        const dept = $("#addDept #dept-new").val();
        const loc = $("#loc-new").val();
        if (dept && loc) {
          const deptExists = allDepartments.includes(dept);
          if (!deptExists) {
            $.ajax({
              url: "libs/php/insertDepartment.php",
              type: "GET",
              dataType: "json",
              data: {
                name: dept,
                locationID: loc,
              },
              success: function (result) {
                if (result.status.code == 200) {
                  $("#addDept").modal("hide");
                  $(".toast-success .toast-body").html(
                    "New Department Added Successfully"
                  );
                  successToast.show();
                  $(".dept-dtl").empty();
                  getAllDepartments();
                }
              },
              error: function (jqXHR, textStatus, errorThrown) {
                // your error code
                console.log(textStatus);
                console.log(errorThrown);
                console.log(jqXHR);
              },
            });
          } else {
            $("#addDept").modal("hide");
            $(".toast-info .toast-body").html(`Department already exists`);
            infoToast.show();
          }
        }
      });
  });

// Delete Department

$("body").on("click", ".delete-dept", function (e) {
  e.preventDefault();
  var depID = $(this).closest("tr").find("td.deptt").data("depttid");
  deptConfirm.show();

  $(".deptConfirm .confirm")
    .unbind()
    .click(() => {
      const result = getPersonnelByDepartment(depID);

      if (result.data.length > 0) {
        deptConfirm.hide();
        $(".toast-danger .toast-header strong").html(
          "Cannot delete Department"
        );
        $(".toast-danger .toast-body").html(
          result.data[0].count +
            " employee record(s) related to this department"
        );
        dangerToast.show();
      } else {
        $.ajax({
          url: "libs/php/deleteDepartmentByID.php",
          type: "GET",
          dataType: "json",
          data: {
            id: depID,
          },
          success: function (result) {
            deptConfirm.hide();
            $(".toast-success .toast-body").html(
              "Department deleted successfully"
            );
            successToast.show();
            $(".dept-dtl").empty();
            getAllDepartments();
          },
          error: function (jqXHR, textStatus, errorThrown) {
            // your error code
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
          },
        });
      }
    });
});

// Edit department

$("body").on("click", ".edit-dept", function (e) {
  e.preventDefault();
  var value = $(this).closest("tr").find(".deptt").text();
  var deptID = $(this).closest("tr").find("td.deptt").data("depttid");
  var locId = $(this).closest("tr").find("td.locc").data("locid");

  $("#editDeptt").modal("show");
  $("#editDeptt #deptt-edit").val(value);
  $("#editDeptt #locc-edit").val(locId);
  $(".updateDept-btn")
    .unbind()
    .click(() => {
      $("#editDeptt").modal("hide");

      const result = getPersonnelByDepartment(deptID);
      if (result.data) {
        $(".toastUpdate .toast-body h6").html(
          result.data[0].count +
            "  personnel(s) will be affected with this update."
        );

        updateToast.show();
        $(".toast-update-btn").click(() => {
          const newDeptt = $("#editDeptt #deptt-edit").val();
          const newDepartment = $("#editDeptt #deptt-edit").text();
          const newID = $("#editDeptt #locc-edit").val();

          if (newDepartment !== value) {
            const deptExists = allDepartments.includes(newDeptt);
            if (!deptExists) {
              $.ajax({
                url: "libs/php/updateDepartment.php",
                type: "GET",
                dataType: "json",
                data: {
                  name: newDeptt,
                  id: deptID,
                  locationID: newID,
                },
                success: function (result) {
                  updateToast.hide();
                  $(".toast-success .toast-body").html("Department Updated");
                  successToast.show();
                  $(".dept-dtl").empty();
                  getAllDepartments();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                  // your error code
                  console.log(textStatus);
                  console.log(errorThrown);
                  console.log(jqXHR);
                },
              });
            } else {
              updateToast.hide();
              $(".toast-info .toast-body").html(`"${newDeptt}" already exists`);
              infoToast.show();
            }
          }
        });
      }
    });
});

// -----------------------------------------------------PERSONNEL------------------------------------------------

$("body").on("change", "#addUser .add-user-dept", function (e) {
  const val = $("#addUser .add-user-dept").val();
  $.ajax({
    url: "libs/php/getLocationByDept.php",
    type: "GET",
    dataType: "json",
    data: {
      id: val,
    },
    success: function (result) {
      $("#addUser #add-user-loc").val(result.data[0].locationID);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // your error code
      console.log(textStatus);
      console.log(errorThrown);
      console.log(jqXHR);
    },
  });
});

// Add User
$(".add-user").click(() => {
  $("#addUser").modal("show");
  var newDept = $("#new-dept").val();
  var newLoc = $("#new-location").val("");
  var firstname = $("#firstName").val("");
  var lastname = $("#lastName").val("");
  var email = $("#email").val("");
  $(".addUser-btn")
    .unbind()
    .click(() => {
      newDept = $("#new-dept").val();
      var departt = $(".add-user-dept option:selected").text();
      newLoc = $("#new-location").val();
      firstname = $("#firstName").val();
      lastname = $("#lastName").val();
      email = $("#email").val();

      if (newDept && firstname && lastname && email) {
        $.ajax({
          url: "libs/php/insertPersonnel.php",
          type: "GET",
          dataType: "json",
          data: {
            firstname: firstname,
            lastname: lastname,
            email: email,
            departmentID: newDept,
            locationID: newLoc,
            department: departt,
          },
          success: function (result) {
            if (result.status.code == 200) {
              $("#addUser").modal("hide");
              $(".toast-success .toast-body").html(
                "New Employee Added Successfully"
              );
              successToast.show();
              $(".employee-dtl").empty();
              getAllPersonnel();
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            // your error code
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
          },
        });
      }
    });
});

// Delete User

$("body").on("click", ".delete-user", function (e) {
  e.preventDefault();
  var value = $(this).closest("tr").find("td.emp").data("id");

  userConfirm.show();
  $(".userConfirm .confirm")
    .unbind()
    .click(() => {
      $.ajax({
        url: "libs/php/deletePersonnel.php",
        type: "GET",
        dataType: "json",
        data: {
          id: value,
        },
        success: function (result) {
          $(".toast-success .toast-body").html(
            "Employee details deleted successfully"
          );
          userConfirm.hide();
          successToast.show();
          $(".employee-dtl").empty();
          getAllPersonnel();
        },
        error: function (jqXHR, textStatus, errorThrown) {
          // your error code
          console.log(textStatus);
          console.log(errorThrown);
          console.log(jqXHR);
        },
      });
    });
});

// Edit USer
$("body").on("click", ".edit-user", function (e) {
  e.preventDefault();

  var deptID = $(this).closest("tr").find("td.department_row").data("deptid");
  var locID = $(this).closest("tr").find("td.location_row").data("locid");
  var empID = $(this).closest("tr").find("td.emp").data("id");

  $("body").on("change", "#editUser .editDept", function (e) {
    e.preventDefault();

    const newDept = $("#editUser .editDept").val();

    $.ajax({
      url: "libs/php/getLocationByDept.php",
      type: "GET",
      dataType: "json",
      data: {
        id: newDept,
      },
      success: function (result) {
        $("#editUser .editLocation").val(result.data[0].locationID).change();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // your error code
        console.log(textStatus);
        console.log(errorThrown);
        console.log(jqXHR);
      },
    });
  });

  $.ajax({
    url: "libs/php/getPersonnelByID.php",
    type: "GET",
    dataType: "json",
    data: {
      id: empID,
      deptID: deptID,
    },
    success: function (result) {
      $("#editUser").modal("show");
      $("#editUser .editFirst").val(result.data.personnel[0].firstName);
      $("#editUser .editLast").val(result.data.personnel[0].lastName);
      $("#editUser .editEmail").val(result.data.personnel[0].email);
      $("#editUser .editDept").val(result.data.department[0].departmentID);
      $("#editUser .editLocation").val(result.data.department[0].locationID);

      $(".update-user")
        .unbind()
        .click(() => {
          const updatePersonnel = {
            id: result.data.personnel[0].id,
            firstName: $("#editUser .editFirst").val(),
            lastName: $("#editUser .editLast").val(),
            email: $("#editUser .editEmail").val(),
            department: $("#editUser .editDept").val(),
            location: $("#editUser .editLocation").val(),
          };
          if (
            updatePersonnel.firstName &&
            updatePersonnel.lastName &&
            updatePersonnel.email &&
            updatePersonnel.department &&
            updatePersonnel.location
          ) {
            $.ajax({
              url: "libs/php/updatePersonnel.php",
              type: "GET",
              dataType: "json",
              data: {
                id: updatePersonnel.id,
                firstname: updatePersonnel.firstName,
                lastname: updatePersonnel.lastName,
                email: updatePersonnel.email,
                departmentID: updatePersonnel.department,
                locationID: updatePersonnel.location,
              },
              success: function (result) {
                if (result.status.code == 200) {
                  $("#editUser").modal("hide");

                  $(".toast-success .toast-body").html(
                    "Employee Details Updated Successfully"
                  );

                  successToast.show();
                  $(".employee-dtl").empty();
                  getAllPersonnel();
                }
              },
              error: function (jqXHR, textStatus, errorThrown) {
                // your error code
                console.log(textStatus);
                console.log(errorThrown);
                console.log(jqXHR);
              },
            });
          }
        });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // your error code
      console.log(textStatus);
      console.log(errorThrown);
      console.log(jqXHR);
    },
  });
});

//   ----------------------------------------------------LOCATION--------------------------------------------------

// ADD LOCATION
$(".add-loc")
  .unbind()
  .click(() => {
    $("#addLoc").modal("show");
    $("#location-new").val("");
    $(".addLoc-btn")
      .unbind()
      .click(() => {
        const locationNew = $("#location-new").val();
        if (locationNew) {
          const locExists = locations.includes(locationNew);
          if (!locExists) {
            $.ajax({
              url: "libs/php/insertLocation.php",
              type: "GET",
              dataType: "json",
              data: {
                name: locationNew,
              },
              success: function (result) {
                if (result.status.code == 200) {
                  $("#addLoc").modal("hide");
                  $(".loc-dtl").empty();
                  $(".toast-success .toast-body").html(
                    "New Location Added Successfully"
                  );
                  successToast.show();
                  getAllLocation();
                }
              },
              error: function (jqXHR, textStatus, errorThrown) {
                // your error code
                console.log(textStatus);
                console.log(errorThrown);
                console.log(jqXHR);
              },
            });
          } else {
            $("#addLoc").modal("hide");
            $(".toast-info .toast-body").html(`Location already exists`);
            infoToast.show();
          }
        } else {
          $(".toast-danger .toast-header strong").html("Enter Location Value");

          dangerToast.show();
        }
      });
  });

// Delete LOcation
$("body").on("click", ".delete-loc", function (e) {
  e.preventDefault();

  const value = $(this).closest("tr").find("td.location-r").data("id");
  locConfirm.show();
  $(".locConfirm .confirm")
    .unbind()
    .click(() => {
      const result = getPersonnelByLocation(value);
      if (result.data.length > 0) {
        locConfirm.hide();
        $(".toast-danger .toast-header strong").html("Cannot delete Location");
        $(".toast-danger .toast-body").html(
          result.data[0].count +
            " department record(s) related to this location"
        );
        dangerToast.show();
      } else {
        $.ajax({
          url: "libs/php/deleteLocationByID.php",
          type: "GET",
          dataType: "json",
          data: {
            id: value,
          },
          success: function (result) {
            locConfirm.hide();
            $(".toast-success .toast-body").html(
              "Location deleted successfully"
            );
            successToast.show();

            //   Update Table

            getAllLocation();
          },
          error: function (jqXHR, textStatus, errorThrown) {
            // your error code
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
          },
        });
      }
    });
});

// Edit Location

$("body").on("click", ".edit-loc", function (e) {
  e.preventDefault();
  var value = $(this).closest("tr").find(".location-r").text();
  var locID = $(this).closest("tr").find("td.location-r").data("id");

  $("#editLocation").modal("show");

  $("#editLocation #edit-loc").val(value);
  $(".update-location")
    .unbind()
    .click(() => {
      $("#editLocation").modal("hide");

      const result = getPersonnelByLocation(locID);
      if (result.data) {
        $(".toastUpdate .toast-body h6").html(
          result.data[0].count +
            "  department(s) will be affected with this update."
        );

        updateToast.show();
        $(".toast-update-btn")
          .unbind()
          .click(() => {
            const newLoc = $("#edit-loc").val();
            const locationExists = locations.includes(newLoc);

            if (!locationExists) {
              $.ajax({
                url: "libs/php/updateLocation.php",
                type: "GET",
                dataType: "json",
                data: {
                  name: newLoc,
                  id: locID,
                },
                success: function (result) {
                  updateToast.hide();

                  $(".toast-success .toast-body").html("Location Updated");
                  successToast.show();
                  $(".loc-dtl").empty();
                  getAllLocation();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                  // your error code
                  console.log(textStatus);
                  console.log(errorThrown);
                  console.log(jqXHR);
                },
              });
            } else {
              updateToast.hide();
              $(".toast-info .toast-body").html(`"${newLoc}" already exists`);
              infoToast.show();
            }
          });
      }
    });
});
