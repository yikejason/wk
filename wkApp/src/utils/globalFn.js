export function isPupil(PhaseID){
    const PhaseEnum = {30030: true, 30020: true, 30040: false};
    if (PhaseEnum[PhaseID]) {
        return true;
    } else {
        return false;
    }
}

export function isMiddleSchoolStudent(PhaseID) {
    const PhaseEnum = {30030: true, 30020: false, 30040: true};
    if (PhaseEnum[PhaseID]) {
        return true;
    } else {
        return false;
    }
}