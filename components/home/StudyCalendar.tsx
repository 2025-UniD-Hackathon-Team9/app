import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';

interface StudyRecord {
  date: string; // 'YYYY-MM-DD'
  sessionsCompleted: number;
}

interface StudyCalendarProps {
  studyRecords: StudyRecord[];
  currentMonth: Date;
}

export default function StudyCalendar({ studyRecords, currentMonth }: StudyCalendarProps) {
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getStudyLevel = (sessionsCompleted: number): number => {
    if (sessionsCompleted === 0) return 0;
    if (sessionsCompleted < 3) return 1;
    if (sessionsCompleted < 5) return 2;
    return 3;
  };

  const getDateString = (day: number): string => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  const getSessionsForDate = (day: number): number => {
    const dateStr = getDateString(day);
    const record = studyRecords.find(r => r.date === dateStr);
    return record ? record.sessionsCompleted : 0;
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  const monthName = currentMonth.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });

  // 달력 그리드 생성
  const calendarDays: (number | null)[] = [];

  // 시작 요일 전까지 빈 칸
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // 실제 날짜들
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>활동</Text>
        <Text style={styles.monthName}>{monthName}</Text>
      </View>

      {/* 요일 헤더 */}
      <View style={styles.weekDaysRow}>
        {weekDays.map((day, index) => (
          <View key={index} style={styles.weekDayCell}>
            <Text
              style={[
                styles.weekDayText,
                (index === 0 || index === 6) && styles.weekendText
              ]}
            >
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* 날짜 그리드 */}
      <View style={styles.calendarGrid}>
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <View key={`empty-${index}`} style={styles.dayCell} />;
          }

          const sessions = getSessionsForDate(day);
          const level = getStudyLevel(sessions);
          const isToday =
            day === new Date().getDate() &&
            currentMonth.getMonth() === new Date().getMonth() &&
            currentMonth.getFullYear() === new Date().getFullYear();

          return (
            <View key={day} style={styles.dayCell}>
              <View
                style={[
                  styles.dayContent,
                  level > 0 && styles[`level${level}` as keyof typeof styles],
                  isToday && styles.today,
                ]}
              >
                <Text
                  style={[
                    styles.dayNumber,
                    level > 0 && styles.dayNumberActive,
                    isToday && styles.dayNumberToday,
                  ]}
                >
                  {day}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* 범례 */}
      <View style={styles.legend}>
        <Text style={styles.legendLabel}>활동량:</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.level1]} />
            <Text style={styles.legendText}>낮음</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.level2]} />
            <Text style={styles.legendText}>중간</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.level3]} />
            <Text style={styles.legendText}>높음</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral.white,
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  monthName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
  },
  weekDayText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text.secondary,
  },
  weekendText: {
    color: colors.neutral.black,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    padding: 3,
  },
  dayContent: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: colors.neutral.gray50,
    position: 'relative',
  },
  dayNumber: {
    fontSize: 13,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  dayNumberActive: {
    color: colors.neutral.white,
    fontWeight: '700',
  },
  dayNumberToday: {
    fontWeight: 'bold',
  },
  today: {
    borderWidth: 2.5,
    borderColor: colors.accent[500],
    shadowColor: colors.accent[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  level0: {
    backgroundColor: colors.neutral.gray50,
  },
  level1: {
    backgroundColor: colors.primary[200],
  },
  level2: {
    backgroundColor: colors.primary[400],
  },
  level3: {
    backgroundColor: colors.primary[600],
  },
  legend: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  legendLabel: {
    fontSize: 13,
    color: colors.text.primary,
    fontWeight: '600',
  },
  legendItems: {
    flexDirection: 'row',
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 11,
    color: colors.text.secondary,
    fontWeight: '500',
  },
});
