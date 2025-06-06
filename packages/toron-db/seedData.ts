import { EquipmentType } from './schema'

type RawExercise = {
  id: string
  name: string
  description?: string
  equipmentType: EquipmentType
}

export const exercisesArray: RawExercise[] = [
  { id: '1', name: 'Ab Wheel', equipmentType: 'other' },
  { id: '2', name: 'Alternating DB Press', equipmentType: 'dumbbell' },
  { id: '3', name: 'Alternating Hammer Curl', equipmentType: 'dumbbell' },
  { id: '4', name: 'Ankle and Big Toe Dorsiflexion', equipmentType: 'other' },
  { id: '5', name: '1-Arm Cable Rows', equipmentType: 'cable' },
  { id: '6', name: '1-Arm Lat Pull Downs', equipmentType: 'cable' },
  { id: '7', name: '1-Arm Tricep Pushdown', equipmentType: 'cable' },
  { id: '8', name: 'Back Raise', equipmentType: 'bodyweight' },
  { id: '9', name: 'Band Good Mornings', equipmentType: 'band' },
  { id: '10', name: 'Band Pullaparts', equipmentType: 'band' },
  { id: '11', name: 'Band Pullover Dead Bugs', equipmentType: 'band' },
  { id: '12', name: 'Barbell Curls', equipmentType: 'barbell' },
  { id: '13', name: 'Barbell Hip Thrust', equipmentType: 'barbell' },
  { id: '14', name: 'Barbell Russian Twists', equipmentType: 'barbell' },
  { id: '15', name: 'Barbell Shrugs', equipmentType: 'barbell' },
  { id: '16', name: 'Barbell Skullcrushers', equipmentType: 'barbell' },
  { id: '17', name: 'Bayesian Bicep Curl', equipmentType: 'barbell' },
  { id: '18', name: 'Bear Crawl Rock Backs', equipmentType: 'bodyweight' },
  { id: '19', name: 'Bear Crawl Shoulder Touch', equipmentType: 'bodyweight' },
  { id: '20', name: 'Belt Squat', equipmentType: 'other' },
  { id: '21', name: 'Bent Knee Calf Raises', equipmentType: 'bodyweight' },
  { id: '22', name: 'Bentover Rows', equipmentType: 'barbell' },
  { id: '23', name: 'Bird Dogs', equipmentType: 'bodyweight' },
  { id: '24', name: '2" Block Pull', equipmentType: 'barbell' },
  { id: '25', name: 'Block Pull', equipmentType: 'barbell' },
  { id: '26', name: 'Box Deadlift', equipmentType: 'barbell' },
  { id: '27', name: 'Box Jumps', equipmentType: 'bodyweight' },
  { id: '28', name: 'Box Pushups', equipmentType: 'bodyweight' },
  { id: '29', name: 'Box Squat', equipmentType: 'barbell' },
  { id: '30', name: 'Bradford Presses', equipmentType: 'barbell' },
  { id: '31', name: '90/90 Breathing', equipmentType: 'bodyweight' },
  { id: '32', name: 'Cable Cross Overs', equipmentType: 'cable' },
  { id: '33', name: 'Cable Curl', equipmentType: 'cable' },
  { id: '34', name: 'Cable Fly', equipmentType: 'cable' },
  { id: '35', name: 'Cable Hercules Curls', equipmentType: 'cable' },
  { id: '36', name: 'Cable Rope Curl', equipmentType: 'cable' },
  { id: '37', name: 'Calf Raises', equipmentType: 'bodyweight' },
  { id: '38', name: 'Cambered Bar Bench', equipmentType: 'barbell' },
  { id: '39', name: 'Chest Supported Rows', equipmentType: 'machine' },
  { id: '40', name: 'Chin-ups', equipmentType: 'bodyweight' },
  { id: '41', name: 'Chinup Grip Pulldowns', equipmentType: 'cable' },
  { id: '42', name: 'Clapping pushup', equipmentType: 'bodyweight' },
  { id: '43', name: 'Close Grip Slingshot', equipmentType: 'barbell' },
  { id: '44', name: 'Closegrip Bench', equipmentType: 'barbell' },
  { id: '45', name: 'Closegrip Pushup', equipmentType: 'bodyweight' },
  { id: '46', name: 'Comp Bench', equipmentType: 'barbell' },
  { id: '47', name: 'Comp Deadlift', equipmentType: 'barbell' },
  { id: '48', name: 'Comp Squat', equipmentType: 'barbell' },
  { id: '49', name: 'Concentration Curls', equipmentType: 'dumbbell' },
  { id: '50', name: '3" Conv Block Pull', equipmentType: 'barbell' },
  { id: '51', name: '1" Conv Deficit Deadlift', equipmentType: 'barbell' },
  { id: '52', name: 'Conventional Deadlift', equipmentType: 'barbell' },
  { id: '53', name: 'Conventional Deadlift (Tech)', equipmentType: 'barbell' },
  {
    id: '54',
    name: 'Conventional Deadlift Touch n Go w/ straps',
    equipmentType: 'barbell',
  },
  { id: '55', name: 'Couch Stretch', equipmentType: 'other' },
  { id: '56', name: '5 Count Pause Bench', equipmentType: 'barbell' },
  { id: '57', name: '3 Count Pause Bench', equipmentType: 'barbell' },
  { id: '58', name: 'DB Alternating Curls', equipmentType: 'dumbbell' },
  { id: '59', name: 'DB Arnold Press', equipmentType: 'dumbbell' },
  { id: '60', name: 'DB Bench', equipmentType: 'dumbbell' },
  { id: '61', name: 'DB Bench w/ Deep Stretch', equipmentType: 'dumbbell' },
  { id: '62', name: 'DB Cuban Press', equipmentType: 'dumbbell' },
  { id: '63', name: 'DB Curls', equipmentType: 'dumbbell' },
  { id: '64', name: 'DB Drag Curls', equipmentType: 'dumbbell' },
  { id: '65', name: 'DB Floor Press', equipmentType: 'dumbbell' },
  { id: '66', name: 'DB Fly', equipmentType: 'dumbbell' },
  { id: '67', name: 'DB Front Raise', equipmentType: 'dumbbell' },
  { id: '68', name: 'DB Incline Bench', equipmentType: 'dumbbell' },
  { id: '69', name: 'DB Jumps', equipmentType: 'dumbbell' },
  { id: '70', name: 'DB Lateral Raise', equipmentType: 'dumbbell' },
  { id: '71', name: 'DB Military Press', equipmentType: 'dumbbell' },
  { id: '72', name: 'DB Pinwheel Curls', equipmentType: 'dumbbell' },
  { id: '73', name: 'DB Pull Overs', equipmentType: 'dumbbell' },
  { id: '74', name: 'DB RDLs', equipmentType: 'dumbbell' },
  { id: '75', name: 'DB Rear Delt Fly', equipmentType: 'dumbbell' },
  { id: '76', name: 'DB Rows', equipmentType: 'dumbbell' },
  { id: '77', name: 'DB Shrugs', equipmentType: 'dumbbell' },
  { id: '78', name: 'Dead Bugs', equipmentType: 'bodyweight' },
  { id: '79', name: 'Dead Squat', equipmentType: 'barbell' },
  { id: '80', name: 'Decline Push-ups', equipmentType: 'bodyweight' },
  { id: '81', name: 'Deficit DB RDL', equipmentType: 'dumbbell' },
  { id: '82', name: 'Depth Jumps', equipmentType: 'bodyweight' },
  { id: '83', name: 'Depth Pushups', equipmentType: 'bodyweight' },
  { id: '84', name: 'Diamond Pushups', equipmentType: 'bodyweight' },
  { id: '85', name: 'Dicks Press', equipmentType: 'barbell' },
  { id: '86', name: 'Dips', equipmentType: 'bodyweight' },
  {
    id: '87',
    name: 'Double Overhand 1" Conv Deficit Deadlift',
    equipmentType: 'barbell',
  },
  { id: '88', name: 'Drag Curls', equipmentType: 'barbell' },
  { id: '89', name: 'Drop Pushups', equipmentType: 'bodyweight' },
  { id: '90', name: 'Elbows Out DB Extensions', equipmentType: 'dumbbell' },
  { id: '91', name: 'Extra Wide Bench Press', equipmentType: 'barbell' },
  { id: '92', name: 'EZ Bar Curls', equipmentType: 'barbell' },
  { id: '93', name: 'Face Pulls', equipmentType: 'cable' },
  { id: '94', name: 'Farmers Walk', equipmentType: 'other' },
  { id: '95', name: 'Feet Up Bench', equipmentType: 'barbell' },
  { id: '96', name: 'Floor Press', equipmentType: 'barbell' },
  {
    id: '97',
    name: 'Front Foot Elevated Split Squat',
    equipmentType: 'barbell',
  },
  { id: '98', name: 'Front Plank', equipmentType: 'bodyweight' },
  { id: '99', name: 'Front Plank w/ Band Row', equipmentType: 'bodyweight' },
  { id: '100', name: 'Front Squat', equipmentType: 'barbell' },
  { id: '101', name: 'GHR', equipmentType: 'bodyweight' },
  { id: '102', name: 'Glute Bridge', equipmentType: 'bodyweight' },
  { id: '103', name: 'Goblet Pause Squat', equipmentType: 'dumbbell' },
  { id: '104', name: 'Goblet Squat', equipmentType: 'dumbbell' },
  { id: '105', name: 'Good Mornings', equipmentType: 'barbell' },
  { id: '106', name: 'Hack Squat', equipmentType: 'machine' },
  {
    id: '107',
    name: 'Halting Conventional Deadlift',
    equipmentType: 'barbell',
  },
  { id: '108', name: 'Halting Sumo Deadlift', equipmentType: 'barbell' },
  { id: '109', name: 'Hammer Curls', equipmentType: 'dumbbell' },
  { id: '110', name: 'Hamstring Curls', equipmentType: 'machine' },
  { id: '111', name: 'Hand Switch Pushups', equipmentType: 'bodyweight' },
  { id: '112', name: 'Hanging Leg Raises', equipmentType: 'bodyweight' },
  { id: '113', name: 'High Bar Squat', equipmentType: 'barbell' },
  {
    id: '114',
    name: 'High Isometric Conventional Deadlift',
    equipmentType: 'barbell',
  },
  { id: '115', name: 'High Isometric Sumo Deadlift', equipmentType: 'barbell' },
  { id: '116', name: 'High Pin Press', equipmentType: 'barbell' },
  { id: '117', name: 'Hollow Body Hold', equipmentType: 'bodyweight' },
  { id: '118', name: 'Incline Bench', equipmentType: 'barbell' },
  { id: '119', name: 'Incline DB Curl', equipmentType: 'dumbbell' },
  { id: '120', name: 'Incline DB Fly', equipmentType: 'dumbbell' },
  { id: '121', name: 'Incline Hammer Curl', equipmentType: 'dumbbell' },
  { id: '122', name: 'Inverted Rows', equipmentType: 'bodyweight' },
  { id: '123', name: 'Iso Hold DB Lateral Raises', equipmentType: 'dumbbell' },
  { id: '124', name: 'Iso Hold Hammer Curls', equipmentType: 'dumbbell' },
  { id: '125', name: 'Iso Hold Pushups', equipmentType: 'bodyweight' },
  { id: '126', name: 'JM Press', equipmentType: 'barbell' },
  { id: '127', name: 'Keg Carry', equipmentType: 'other' },
  { id: '128', name: 'Kettlebell Swing', equipmentType: 'other' },
  { id: '129', name: 'Lat Pulldowns', equipmentType: 'cable' },
  { id: '130', name: 'Lateral Lunges', equipmentType: 'bodyweight' },
  { id: '131', name: 'Leg Extensions', equipmentType: 'machine' },
  { id: '132', name: 'Leg Press/Hack Squat', equipmentType: 'machine' },
  { id: '133', name: 'Low Bar Squat', equipmentType: 'barbell' },
  { id: '134', name: 'Low Box Squat', equipmentType: 'barbell' },
  {
    id: '135',
    name: 'Low Isometric Conventional Deadlift',
    equipmentType: 'barbell',
  },
  { id: '136', name: 'Low Isometric Sumo Deadlift', equipmentType: 'barbell' },
  { id: '137', name: 'Low Pin Press', equipmentType: 'barbell' },
  { id: '138', name: 'Lunges', equipmentType: 'dumbbell' },
  { id: '139', name: 'Lying Leg Curl', equipmentType: 'machine' },
  { id: '140', name: 'Machine Assisted Nordic Ham', equipmentType: 'machine' },
  { id: '141', name: 'Machine Chest Press', equipmentType: 'machine' },
  { id: '142', name: 'Machine Curl', equipmentType: 'machine' },
  { id: '143', name: 'Machine Hip Abduction', equipmentType: 'machine' },
  { id: '144', name: 'Machine Hip Thrust', equipmentType: 'machine' },
  { id: '145', name: 'Machine Lateral Raise', equipmentType: 'machine' },
  { id: '146', name: 'Machine Military Press', equipmentType: 'machine' },
  { id: '147', name: 'Machine Rear Delt Fly', equipmentType: 'machine' },
  { id: '148', name: 'Machine Shoulder Press', equipmentType: 'machine' },
  { id: '149', name: 'Machine Situp', equipmentType: 'machine' },
  {
    id: '150',
    name: 'Machine-Assisted Nordic Ham Raise',
    equipmentType: 'machine',
  },
  { id: '151', name: 'MB Russian Twists', equipmentType: 'other' },
  { id: '152', name: 'Military Press', equipmentType: 'barbell' },
  { id: '153', name: 'Military Push-ups', equipmentType: 'bodyweight' },
  { id: '154', name: 'Neutral Grip Chinups', equipmentType: 'bodyweight' },
  { id: '155', name: 'Neutral Grip Pulldowns', equipmentType: 'cable' },
  { id: '156', name: 'Neutral Grip Pushup', equipmentType: 'bodyweight' },
  {
    id: '157',
    name: 'Overhead Cable Tricep Extension',
    equipmentType: 'cable',
  },
  { id: '158', name: 'Overhead DB Extensions', equipmentType: 'dumbbell' },
  { id: '159', name: 'Overhead Dicks Press', equipmentType: 'barbell' },
  { id: '160', name: 'Pallof Press', equipmentType: 'cable' },
  {
    id: '161',
    name: 'Pause Above the Knee Conv Deadlift',
    equipmentType: 'barbell',
  },
  {
    id: '162',
    name: 'Pause Above the Knee Sumo Deadlift',
    equipmentType: 'barbell',
  },
  {
    id: '163',
    name: 'Pause Below the Knee Conv Deadlift',
    equipmentType: 'barbell',
  },
  {
    id: '164',
    name: 'Pause Below the Knee Sumo Deadlift',
    equipmentType: 'barbell',
  },
  { id: '165', name: 'Pause Front Squat', equipmentType: 'barbell' },
  { id: '166', name: 'Pause High Bar Squat', equipmentType: 'barbell' },
  { id: '167', name: 'Pause Leg Press/Hack Squat', equipmentType: 'machine' },
  {
    id: '168',
    name: 'Pause Off the Floor Conv Deadlift',
    equipmentType: 'barbell',
  },
  {
    id: '169',
    name: 'Pause Off the Floor Sumo Deadlift',
    equipmentType: 'barbell',
  },
  { id: '170', name: 'Pause Squat', equipmentType: 'barbell' },
  { id: '171', name: 'Pause Squat (Halfway Down)', equipmentType: 'barbell' },
  { id: '172', name: 'Pause Squat (Halfway Up)', equipmentType: 'barbell' },
  { id: '173', name: 'Paused At Knee Sumo Deadlift', equipmentType: 'barbell' },
  { id: '174', name: 'Pec Deck', equipmentType: 'machine' },
  { id: '175', name: 'Pendlay Row', equipmentType: 'barbell' },
  { id: '176', name: 'Pendulum Squat', equipmentType: 'machine' },
  { id: '177', name: 'Plate Front Raises', equipmentType: 'other' },
  { id: '178', name: 'Plate Front Raises with Twist', equipmentType: 'other' },
  { id: '179', name: 'Plyo Push-up', equipmentType: 'bodyweight' },
  { id: '180', name: 'Preacher Curls', equipmentType: 'barbell' },
  { id: '181', name: 'Pull Throughs', equipmentType: 'cable' },
  { id: '182', name: 'Pullups', equipmentType: 'bodyweight' },
  { id: '183', name: 'Push Press', equipmentType: 'barbell' },
  { id: '184', name: 'Pushups w/ Deep Stretch', equipmentType: 'bodyweight' },
  { id: '185', name: 'RDL w/ Band Around Hips', equipmentType: 'barbell' },
  { id: '186', name: 'RDLs', equipmentType: 'barbell' },
  {
    id: '187',
    name: 'Rear Foot Elevated Split Squat',
    equipmentType: 'dumbbell',
  },
  { id: '188', name: 'Reverse Band Bench', equipmentType: 'barbell' },
  { id: '189', name: 'Reverse Band Conv Deadlift', equipmentType: 'barbell' },
  { id: '190', name: 'Reverse Band Deadlift', equipmentType: 'barbell' },
  { id: '191', name: 'Reverse Band Squat', equipmentType: 'barbell' },
  { id: '192', name: 'Reverse Band Sumo Deadlift', equipmentType: 'barbell' },
  { id: '193', name: 'Reverse Grip Tricep Pushdown', equipmentType: 'cable' },
  { id: '194', name: 'Reverse Hack Squat', equipmentType: 'machine' },
  { id: '195', name: 'Reverse Hyper', equipmentType: 'machine' },
  { id: '196', name: 'Rolling Tricep Extensions', equipmentType: 'dumbbell' },
  { id: '197', name: 'SA Farmers Walk', equipmentType: 'dumbbell' },
  { id: '198', name: 'Sandbag Carry', equipmentType: 'other' },
  { id: '199', name: 'Seal Rows', equipmentType: 'barbell' },
  { id: '200', name: 'Seated DB Military Press', equipmentType: 'dumbbell' },
  { id: '201', name: 'Seated Military Press', equipmentType: 'barbell' },
  { id: '202', name: 'Seated Rows', equipmentType: 'cable' },
  { id: '203', name: 'Shrugs', equipmentType: 'barbell' },
  { id: '204', name: 'Side Plank', equipmentType: 'bodyweight' },
  { id: '205', name: 'Side Plank w/ Rotation', equipmentType: 'bodyweight' },
  { id: '206', name: 'Single Leg Calf Raises', equipmentType: 'bodyweight' },
  { id: '207', name: 'Single Leg Reverse Hyper', equipmentType: 'machine' },
  { id: '208', name: 'Single-Arm Cable Curl', equipmentType: 'cable' },
  { id: '209', name: 'Skullcrusher', equipmentType: 'barbell' },
  { id: '210', name: 'Skullcrushers (Standing)', equipmentType: 'barbell' },
  { id: '211', name: 'SL Glute Bridge', equipmentType: 'bodyweight' },
  { id: '212', name: 'SL Hip Thrust', equipmentType: 'bodyweight' },
  { id: '213', name: 'SL Leg Press/Hack Squat', equipmentType: 'machine' },
  { id: '214', name: 'Slingshot Bench', equipmentType: 'barbell' },
  { id: '215', name: 'Snatch Grip RDL', equipmentType: 'barbell' },
  {
    id: '216',
    name: 'Snatch Grip Tempo Deadlifts (4:0:4)',
    equipmentType: 'barbell',
  },
  { id: '217', name: 'Snatch-Grip Deadlift', equipmentType: 'barbell' },
  { id: '218', name: 'Special Bicep Lat Pulldown', equipmentType: 'cable' },
  {
    id: '219',
    name: 'Split Squat (Glute Emphasis)',
    equipmentType: 'dumbbell',
  },
  { id: '220', name: 'Split Squat (Quad Emphasis)', equipmentType: 'dumbbell' },
  { id: '221', name: 'Spoto Press', equipmentType: 'barbell' },
  { id: '222', name: 'Squat Jump', equipmentType: 'bodyweight' },
  { id: '223', name: 'Squat Morning', equipmentType: 'barbell' },
  { id: '224', name: 'SSB Squat', equipmentType: 'barbell' },
  { id: '225', name: 'Staggered RDL w/ Pause', equipmentType: 'dumbbell' },
  { id: '226', name: 'Staggered Stance RDLs', equipmentType: 'dumbbell' },
  { id: '227', name: 'Step Ups', equipmentType: 'bodyweight' },
  { id: '228', name: '3" Sumo Block Pull', equipmentType: 'barbell' },
  { id: '229', name: 'Sumo Deadlift', equipmentType: 'barbell' },
  { id: '230', name: 'Sumo Deadlift (Tech)', equipmentType: 'barbell' },
  {
    id: '231',
    name: 'Sumo Deadlift Touch n Go w/ straps',
    equipmentType: 'barbell',
  },
  { id: '232', name: '1" Sumo Deficit Deadlift', equipmentType: 'barbell' },
  { id: '233', name: 'Sumo Stance RDL', equipmentType: 'dumbbell' },
  {
    id: '234',
    name: 'Tall Kneeling Glute Activation',
    equipmentType: 'bodyweight',
  },
  { id: '235', name: 'Tempo DB Press (5:0:5)', equipmentType: 'dumbbell' },
  { id: '236', name: 'Tempo High Bar Squat (5:0:0)', equipmentType: 'barbell' },
  { id: '237', name: 'Tempo Squat (5:0:0)', equipmentType: 'barbell' },
  {
    id: '238',
    name: 'Tempo Stiff Leg Deadlift (5:0:0)',
    equipmentType: 'barbell',
  },
  {
    id: '239',
    name: 'Tempo Wide Grip Bench (5:0:0)',
    equipmentType: 'barbell',
  },
  { id: '240', name: 'Trap Bar Deadlift', equipmentType: 'barbell' },
  { id: '241', name: 'Tricep Kick Back', equipmentType: 'dumbbell' },
  { id: '242', name: 'Tricep Pushdown', equipmentType: 'cable' },
  { id: '243', name: 'Tricep Rope Extensions', equipmentType: 'cable' },
  { id: '244', name: 'TRX IYT', equipmentType: 'bodyweight' },
  {
    id: '245',
    name: 'Underhand Grip Chest Supported Rows',
    equipmentType: 'cable',
  },
  { id: '246', name: 'Underhand Grip Seal Rows', equipmentType: 'barbell' },
  { id: '247', name: 'Underhand Lat Machine Row', equipmentType: 'cable' },
  { id: '248', name: 'Upper Back Cat/Cow', equipmentType: 'bodyweight' },
  { id: '249', name: 'Upright Rows', equipmentType: 'barbell' },
  { id: '250', name: 'V-Ups', equipmentType: 'bodyweight' },
  { id: '251', name: 'Weighted Situps', equipmentType: 'bodyweight' },
  { id: '252', name: 'Wide Grip Seated Row', equipmentType: 'cable' },
  { id: '253', name: 'Yates Rows', equipmentType: 'barbell' },
  { id: '254', name: 'Yoke Walk', equipmentType: 'other' },
  { id: '255', name: 'Zottman Curls', equipmentType: 'dumbbell' },
]
