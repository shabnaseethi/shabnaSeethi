var departmentID = 0;
var locationID = 0;
var locations = [];
var allDepartments = [];
var allPersonnel = [];

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
      allPersonnel = result.data.map(({ id, firstName, lastName }) => ({
        id,
        firstName,
        lastName,
      }));

      result.data.forEach((employee) => {
        $(".employee-dtl tbody").append(`
        <tr>       
        <td class="emp" data-id=${employee.id}>${employee.firstName}</td>
        <td class="lastname">${employee.lastName}</td>
        <td class="department_row d-none d-lg-table-cell" data-deptid=${employee.departmentID}>${employee.department}</td>
        <td class="location_row d-none d-lg-table-cell" data-locid=${employee.locationID}>${employee.location}</td>
         <td class=" d-none d-lg-table-cell d-md-table-cell">${employee.email}</td>
        <td class="icon" ><i class="fa-solid fa-trash delete-user"></i></td>
        <td class="icon"><i class="fa-solid fa-pen-to-square edit-user"></i></td>
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
            <th ></th>
          <th ></th>
          </tr>
        </thead>`);

      locations = result.data.map(({ id, name }) => ({ id, name }));

      result.data.forEach((location) => {
        $(".loc-dtl").append(` <tbody> <tr>       
                <td class="location-r" data-id=${location.id}>${location.name}</td>
                <td class="icon"><i class="fa-solid fa-trash delete-loc"></i></td>
                <td class="icon"><i class="fa-solid fa-pen-to-square edit-loc"></i></td>
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


      $(".location").find('option').not(':first').remove();
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
        <th ></th>
          <th ></th>
      </tr>
    </thead>`);
      allDepartments = result.data.map(({ departmentID, department }) => ({
        departmentID,
        department,
      }));
      result.data.map((department) => {
        $(".dept-dtl").append(` <tbody> <tr>       
                <td class="deptt" data-depttid=${department.departmentID}>${department.department}</td>
                <td class="locc" data-locid=${department.locationID}>${department.location}</td>
                <td class="icon"><i class="fa-solid fa-trash delete-dept"></i></td>
                <td class="icon"><i class="fa-solid fa-pen-to-square edit-dept"></i></td>
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
      $(".dept").find('option').not(':first').remove();;
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
  e.preventDefault();
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
            <td class="department_row d-none d-lg-table-cell" data-deptid=${employee.departmentID}>${employee.name}</td>
            <td class="location_row d-none d-lg-table-cell" data-locid=${employee.locationID}>${employee.location}</td>
            <td class="d-none d-lg-table-cell d-md-table-cell">${employee.email}</td>
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
              <td class="department_row d-none d-lg-table-cell " data-deptid=${employee.departmentID}>${employee.name}</td>
              <td class="location_row d-none d-lg-table-cell" data-locid=${employee.locationID}>${employee.location}</td>
              <td class="d-none d-lg-table-cell d-md-table-cell">${employee.email}</td>
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
            <td class="department_row d-none d-lg-table-cell" data-deptid=${employee.departmentID}>${employee.name}</td>
            <td class="location_row d-none d-lg-table-cell" data-locid=${employee.locationID}>${employee.location}</td>
            <td class="d-none d-lg-table-cell d-md-table-cell">${employee.email}</td>
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
            <td class="department_row d-none d-lg-table-cell" data-deptid=${employee.departmentID}>${employee.department}</td>
            <td class="location_row d-none d-lg-table-cell" data-locid=${employee.locationID}>${employee.location}</td>
            <td class="d-none d-lg-table-cell d-md-table-cell">${employee.email}</td>
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
          <td class="department_row d-none d-lg-table-cell" data-deptid=${employee.departmentID}>${employee.department}</td>
          <td class="location_row d-none d-lg-table-cell" data-locid=${employee.locationID}>${employee.location}</td>
          <td class="d-none d-lg-table-cell d-md-table-cell">${employee.email}</td>
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
          <td class="department_row d-none d-lg-table-cell" data-deptid=${employee.departmentID}>${employee.department}</td>
          <td class="location_row d-none d-lg-table-cell" data-locid=${employee.locationID}>${employee.location}</td>
          <td class="d-none d-lg-table-cell d-md-table-cell">${employee.email}</td>
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
  //   Search with firstname,department and location
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
              <td class="department_row d-none d-lg-table-cell" data-deptid=${employee.departmentID}>${employee.department}</td>
              <td class="location_row d-none d-lg-table-cell" data-locid=${employee.locationID}>${employee.location}</td>
              <td class="d-none d-lg-table-cell d-md-table-cell">${employee.email}</td>
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

$(".add-dept").click(() => {
  $("#addDept #dept-new").val("");
  $("#addDept").modal("show");
  $("#addDeptForm").unbind().on("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const dept = $("#addDept #dept-new").val();
    const loc = $("#loc-new").val();
    if (dept && loc) {
      $.ajax({
        url: "libs/php/getDepartmentByName.php",
        type: "GET",
        dataType: "json",
        data: {
          name: dept,
        },
        success: function (result) {
          if (result.data[0].count < 1) {
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

// Delete Department

$("body").on("click", ".delete-dept", function (e) {
  e.preventDefault();
  var depID = $(this).closest("tr").find("td.deptt").data("depttid");

  const result = getPersonnelByDepartment(depID);
  if (result.data.length > 0) {
    deptConfirm.hide();
    $(".toast-danger .toast-header strong").html("Cannot delete Department");
    $(".toast-danger .toast-body").html(
      result.data[0].count + " employee record(s) related to this department"
    );
    dangerToast.show();
  } else {
    const dept = allDepartments.filter((item) => item.departmentID == depID);

    $(".deptConfirm .toast-body span").html(`<b>${dept[0].department}</b>`);
    deptConfirm.show();

    $(".deptConfirm .confirm")
      .unbind()
      .click((e) => {
        e.preventDefault();
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
      });
  }
});

// Edit department

$("body").on("click", ".edit-dept", function (e) {
  var deptID = $(this).closest("tr").find("td.deptt").data("depttid");
  var value = $("#editDeptt #deptt-edit").val("");

  var loccID;
  $.ajax({
    url: "libs/php/getDepartmentByID.php",
    type: "GET",
    dataType: "json",
    data: {
      id: deptID,
    },
    success: function (result) {
      loccID = result.data[0].locationID;

      value = $("#editDeptt #deptt-edit").val(result.data[0].name);

      $("#editDeptt #locc-edit").val(result.data[0].locationID);
      $("#editDeptt").modal("show");
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // your error code
      console.log(textStatus);
      console.log(errorThrown);
      console.log(jqXHR);
    },
  });

  $("#editDeptForm").unbind().on("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();

    $("#editDeptt").modal("hide");
    const newDeptt = $("#editDeptt #deptt-edit").val();
    const newID = $("#editDeptt #locc-edit").val();

    const resultNew = getPersonnelByDepartment(deptID);

    if (newDeptt === value && newID == loccID) {
      $("#addDept").modal("hide");
      $(".toast-info .toast-body").html(`"${newDeptt}" already exists`);
      infoToast.show();
      updateToast.hide();
    } else {
      $.ajax({
        url: "libs/php/getDepartmentByName.php",
        type: "GET",
        dataType: "json",
        data: {
          name: newDeptt,
        },
        success: function (result) {
          if (
            (result.data[0].name === value &&
              result.data[0].locationID != newID) ||
            result.data[0].count < 1
          ) {
            if (resultNew.data.length > 0) {
              $(".toast-update .toastUpdate .toast-body h6").html(
                resultNew.data[0].count +
                  "  personnel(s) will be affected with this update."
              );
            } else {
              $(".toast-update .toastUpdate .toast-body h6").html(
                "0  personnel(s) will be affected with this update."
              );
            }
            updateToast.show();
            $(".toast-update-btn")
              .unbind()
              .click((e) => {
                e.preventDefault();
                e.stopPropagation();
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
              });
          } else {
            $("#addDept").modal("hide");
            $(".toast-info .toast-body").html(
              `Department <b>${newDeptt}</b> already exists`
            );
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
});

// -----------------------------------------------------PERSONNEL------------------------------------------------
// Add User
$(".add-user").click(() => {
  $("#addUser").modal("show");
  var newDept = $("#new-dept").val();
  var firstname = $("#firstName").val("");
  var lastname = $("#lastName").val("");
  var email = $("#email").val("");
  var job = $("#job").val();
  

  $("#addUserForm")
    .unbind()
    .on("submit", (e) => {
      e.preventDefault();
      e.stopPropagation();
      newDept = $("#new-dept").val();
      var departt = $(".add-user-dept option:selected").text();
      newLoc = $("#new-location").val();
      firstname = $("#firstName").val();
      lastname = $("#lastName").val();
      email = $("#email").val();
      job = $("#job").val();

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
            department: departt,
            job:job
          },
          success: function (result) {
            if (result.status.code == 200) {
              $("#addUser").modal("hide");
              $(".toast-success .toast-body").html(
                "New Employee Added Successfully"
              );
              successToast.show();
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
  const empDel = allPersonnel.filter((item) => item.id == value);

  $(".userConfirm .toast-body span").html(
    `<b>${empDel[0].firstName} ${empDel[0].lastName}</b>`
  );
  userConfirm.show();
  $(".userConfirm .confirm")
    .unbind()
    .click(() => {
      e.preventDefault();
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
  // var locID = $(this).closest("tr").find("td.location_row").data("locid");
  var empID = $(this).closest("tr").find("td.emp").data("id");

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
      $("#editUser .editDept").val(result.data.personnel[0].departmentID);
      $("#editUser .editJob").val(result.data.personnel[0].jobTitle);

      $("#editUserForm")
        .unbind()
        .on("submit", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const updatePersonnel = {
            id: result.data.personnel[0].id,
            firstName: $("#editUser .editFirst").val(),
            lastName: $("#editUser .editLast").val(),
            email: $("#editUser .editEmail").val(),
            department: $("#editUser .editDept").val(),
            job:$("#editUser .editJob").val(),
          };

          if (
            updatePersonnel.firstName &&
            updatePersonnel.lastName &&
            updatePersonnel.email &&
            updatePersonnel.department &&
            updatePersonnel.job
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
                job:updatePersonnel.job
              },
              success: function (result) {
                if (result.status.code == 200) {
                  $("#editUser").modal("hide");

                  $(".toast-success .toast-body").html(
                    "Employee Details Updated Successfully"
                  );

                  successToast.show();

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
  .click((e) => {
    e.preventDefault();
    $("#addLoc").modal("show");
    $("#location-new").val("");

    $("#addLocForm").unbind().on("submit", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const locationNew = $("#location-new").val();

      if (locationNew) {
        const locExists = locations.filter((item) => item.name == locationNew);
        if (locExists.length < 1) {
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
          $(".toast-info .toast-body").html(
            `<b>${locationNew}</b> already exists`
          );
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
  const result = getPersonnelByLocation(value);
  if (result.data.length > 0) {
    dangerToast.show();
    $(".toast-danger .toast-header strong").html("Cannot delete Location");
    $(".toast-danger .toast-body").html(
      result.data[0].count + " department record(s) related to this location"
    );
  } else {
    const locDel = locations.filter((item) => item.id == value);

    $(".locConfirm .toast-body span").html(`<b>${locDel[0].name}</b>`);
    locConfirm.show();
    $(".locConfirm .confirm")
      .unbind()
      .click(() => {
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
      });
  }
});

// Edit Location

$("body").on("click", ".edit-loc", function (e) {
  e.preventDefault();

  var locID = $(this).closest("tr").find("td.location-r").data("id");

  $("#editLocation").modal("show");
  $.ajax({
    url: "libs/php/getAllLocation.php",
    type: "GET",
    dataType: "json",
    data: {
      id: locID,
    },
    success: function (result) {
      const loc = result.data.filter((item) => item.id == locID);

      $("#editLocation #edit-loc").val(loc[0].name);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // your error code
      console.log(textStatus);
      console.log(errorThrown);
      console.log(jqXHR);
    },
  });

  $("#editLocForm").unbind().on("submit", (e) => {
    {
      e.preventDefault();
      e.stopPropagation();
      $("#editLocation").modal("hide");

      const result = getPersonnelByLocation(locID);

      const newLoc = $("#edit-loc").val();
      const locationExists = locations.filter((item) => item.name == newLoc);

      if (locationExists.length < 1) {
        if (result.data.length > 0) {
          $(".toastUpdate .toast-body h6").html(
            result.data[0].count +
              "  department(s) will be affected with this update."
          );
        } else {
          $(".toastUpdate .toast-body h6").html(
            0 + "  department(s) will be affected with this update."
          );
        }
        updateToast.show();
        $(".toast-update-btn")
          .unbind()
          .click(() => {
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
          });
      } else {
        updateToast.hide();
        $(".toast-info .toast-body").html(`"${newLoc}" already exists`);
        infoToast.show();
      }
    }
  });
});
