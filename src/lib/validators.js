export function validateLeadData(data) {
    const errors = [];

    if (!data.name || data.name.trim().length < 2) {
        errors.push("Name must be at least 2 characters long.");
    }

    if (!data.phone || !/^[0-9]{10,15}$/.test(data.phone)) {
        errors.push("Phone must contain 10 to 15 digits only.");
    }

    if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) {
        errors.push("Email format is invalid.");
    }

    if (!data.propertyInterest || data.propertyInterest.trim().length < 3) {
        errors.push("Property interest is required.");
    }

    if (!data.budget || Number(data.budget) <= 0) {
        errors.push("Budget must be a positive number.");
    }

    return errors;
}

export function validateStatus(status) {
    const validStatuses = [
        "New",
        "Assigned",
        "Contacted",
        "In Progress",
        "Closed",
        "Lost",
    ];

    return validStatuses.includes(status);
}