const formatDate = date => {
  const month = `00${date.getMonth() + 1}`.slice(-2);
  const day = `00${date.getDate()}`.slice(-2);
  
  return `${month}-${day}`;
}

module.exports = (activities, activityName, from, to) => {
  const trend = { name: activityName, keys: [], totalCount: 0 };
  switch (activityName) {
    case 'breast':
    case 'sleep':
      trend.totalDuration = 0;
      break;

    case 'bottle':
    case 'babyfood':
      trend.totalAmount = 0;
      break;
    
    case 'diaper':
      trend.totalPee = 0;
      trend.totalPoo = 0;
      break;

    default:
      break;
  }

  for (let i = new Date(from); i < new Date(to); i.setDate(i.getDate() + 1)) {
    const date = formatDate(i);
    trend.keys.push(date);
    trend[date] = { count: 0 };
    switch (activityName) {
      case 'breast':
      case 'sleep':
        trend[date].duration = 0;
        break;

      case 'bottle':
      case 'babyfood':
        trend[date].amount = 0;
        break;
      
      case 'diaper':
        trend[date].pee = 0;
        trend[date].poo = 0;
        break;
      
      case 'growth':
        trend[date].height = 0;
        trend[date].weight = 0;
        trend[date].head = 0;
        break;

      default:
        break;
    }
  }

  activities.forEach(({
    name,
    time_start,
    duration_total,
    amount,
    type,
    height,
    weight,
    head,
  }) => {
    const isNameSame = name === activityName;
    const isInRange =
      new Date(from) <= new Date(time_start) &&
      new Date(time_start) <= new Date(to);
    
    if (isNameSame && isInRange) {
      const date = formatDate(new Date(time_start));

      console.log(date);
  
      trend[date].count ++;
      trend.totalCount ++;

      switch (activityName) {
        case 'breast':
        case 'sleep':
          trend[date].duration += duration_total;
          trend.totalDuration += duration_total;
          break;
  
        case 'bottle':
        case 'babyfood':
          trend[date].amount += amount;
          trend.totalAmount += amount;
          break;
        
        case 'diaper':
          if (type && type === 'peepoo') {
            trend[date].pee ++;
            trend[date].poo ++;
            trend.totalPee ++;
            trend.totalPoo ++;
          } else {
            trend[date][type] ++;
            if (type === 'pee') trend.totalPee ++;
            else if (type === 'poo') trend.totalPoo ++;
          }
          break;

        case 'growth':
          trend[date].height = height;
          trend[date].weight = weight;
          trend[date].head = head;
          break;
  
        default:
          break;
      } 
    }
  });

  return trend;
}